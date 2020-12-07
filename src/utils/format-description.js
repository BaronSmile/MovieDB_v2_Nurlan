const formatPost = (str = '', length) => {
  if (str.length <= length) return str;
  const newLength = str.lastIndexOf(' ', length);
  return `${str.slice(0, newLength)} ...`;
};

export default formatPost;