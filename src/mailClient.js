'use strict';
const {google} = require('googleapis');
const searchFilter =
  'subject:"new account" OR subject:"verification code" OR subject:"welcome to" OR subject:"verify your email"';

// https://gist.github.com/lmfresneda/9158e06a93a819a78b30cc175573a8d3
function removeDuplicates(arr, prop) {
  const obj = {};
  return Object.keys(
    arr.reduce((prev, next) => {
      if (!obj[next[prop]]) obj[next[prop]] = next;
      return obj;
    }, obj)
  ).map(i => obj[i]);
}

class MailClient {
  constructor(oAuth2Client) {
    this.oAuth2Client = oAuth2Client;

    this.gmail = google.gmail({
      version: 'v1',
      auth: oAuth2Client,
    });
  }

  async getMailMessages(filter) {
    try {
      const res = await this.gmail.users.messages.list({
        userId: 'me',
        q: filter,
      });
      const messages = res.data.messages;
      console.info(`found ${messages.length} mails`);
      return messages;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async getMessage(message) {
    try {
      const res = await this.gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Received'],
      });
      const result = res.data;
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  parseMessage(message) {
    const headers = JSON.stringify(message.payload.headers);
    let domain = 'undefined';
    let date = 'undefined';
    let timestamp = 0;
    try {
      // Match email
      const fromMatch = headers.match(/\<[^\@]+@([^\>]+)/i);
      if (fromMatch !== null) {
        domain = fromMatch[1];
      }
      // Match date
      const dateMatch = headers.match(/..., \d{1,2} (... \d{4})/i);
      if (dateMatch !== null) {
        date = dateMatch[1];
        timestamp = new Date('1 ' + dateMatch[1]).getTime() / 1000; // Attempt to create date like 1 Oct 2018) and get timstamp
      }
      return {domain: domain, date: date, timestamp: timestamp};
    } catch (e) {
      console.error(e);
      //throw e;
      return {domain: domain, date: date, timestamp: timestamp};
    }
  }
  async getWebsites(messages) {
    const promises = messages.map(async m => await this.getMessage(m));
    const rawResults = await Promise.all(promises);
    const websites = rawResults.map(m => this.parseMessage(m));
    const websitesSorted = websites.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
    const results = removeDuplicates(websitesSorted, 'domain');

    return results;
  }
  async scrape() {
    const messages = await this.getMailMessages(searchFilter);
    const websites = await this.getWebsites(messages);
    return websites;
  }
}

module.exports = MailClient;
