'use strict';

import {Storage} from './common/storage';
const helpers = require('./helpers');

const POLLS_KEY = '__lb_polls_data__';
const POLLS_EXPIRY_DAYS = 365;

const apiHost = LB.api_host.match(/\/$/i) ? LB.api_host : LB.api_host + '/';
const blogId = LB.blog._id;

/**
 * Updates the UI with the new total votes and switches to the poll closed view
 */
function updatePollUI(selectedPoll) {
  const pollElem = document.getElementById(`poll-container-${selectedPoll}`);

  if (pollElem) {
    const postId = pollElem.closest('[data-post-id]').getAttribute('data-post-id');
    const postEndpoint = `${apiHost}api/client_posts/${postId}`;

    helpers.get(postEndpoint)
      .then((post) => {
        var view = require('./view');
        const rendered = view.renderSinglePost(post, false);
        
        if (!view.updatePost(post, rendered)) {
          console.warn("Failed to update post");
        }
      });
  }
}

/**
 * Places a vote for a poll and updates the UI with the new total votes.
 */
function placeVote(event) {
  const { selectedOption, selectedPoll } = event.detail;
  const pollEndpoint = `${apiHost}api/client_polls/${selectedPoll}`;

  helpers.get(pollEndpoint)
    .then((poll) => {
      const etag = poll._etag;
      let data = { "poll_body": { "answers" : poll.poll_body.answers }};
      
      for (let answer of data.poll_body.answers) {
        if (answer.option === selectedOption) {
          answer.votes += 1;
          break; 
        }
      }
      
      helpers.patch(pollEndpoint, data, etag)
        .then((updatedPoll) => {
          updatePollUI(selectedPoll);
          persistVote(selectedPoll, selectedOption);
      });
    });
}

/**
 * Persists the user's vote for a poll in local storage.
 */
function persistVote(selectedPoll, selectedOption) {
  let pollsData = Storage.read(POLLS_KEY) || {};

  pollsData[blogId] = {
    ...pollsData[blogId],
    [selectedPoll]: selectedOption,
  };

  Storage.write(POLLS_KEY, pollsData, POLLS_EXPIRY_DAYS);
}

/**
 * Checks for existing votes in local storage and updates the UI accordingly
 */
function checkExistingVotes() {
  const pollsData = Storage.read(POLLS_KEY) || {};
  const blogPolls = pollsData[blogId];

  if(blogPolls) {
    Object.entries(blogPolls).forEach(([pollId, selectedOption]) => {
      const pollOpenElem = document.getElementById(`poll-open-${pollId}`);
      const pollClosedElem = document.getElementById(`poll-closed-${pollId}`);
      const buttonElem = document.getElementById(`vote-button-${pollId}`);

      if (pollOpenElem && pollClosedElem && buttonElem) {
        pollOpenElem.style.display = "none";
        buttonElem.style.display = "none";
        pollClosedElem.style.display = "flex";
      } 
    });

    pollsData[blogId] = blogPolls;
    Storage.write(POLLS_KEY, pollsData, POLLS_EXPIRY_DAYS);
  }
}

module.exports = {
    init: () => {
        document.addEventListener('place_vote', function (e) {
            placeVote(e);
        });
        checkExistingVotes();
    },
    checkExistingVotes: checkExistingVotes,
};