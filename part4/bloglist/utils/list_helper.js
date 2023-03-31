const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined;
  const max = blogs.reduce((cur, prev) => ((cur.likes > prev.likes) ? cur : prev));
  return max;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;
  const result = _(blogs).countBy('author').entries().maxBy(_.last);
  return { author: result[0], blogs: result[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined;
  const result = blogs
    .reduce(({ sums, most }, { author, likes }) => {
      sums[author] = (sums[author] || 0) + likes;
      likes = sums[author];
      if (likes > most.likes) most = { author, likes };
      return { sums, most };
    }, { sums: {}, most: { likes: 0 } })
    .most;

  return result;
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
