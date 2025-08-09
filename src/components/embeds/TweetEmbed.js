import React from 'react';

export default function TweetEmbed({ tweetId, theme = 'dark' }) {
  return (
    <div className="my-8 flex justify-center">
      <div className="max-w-md w-full">
        <blockquote
          className="twitter-tweet"
          data-theme={theme}
          data-dnt="true"
        >
          <a href={`https://twitter.com/x/status/${tweetId}`}></a>
        </blockquote>
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </div>
    </div>
  );
}
