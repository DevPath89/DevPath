// UserId & Password generate karne ka helper function

function generateCredentials(name, mobileNo) {
  // userId = name ka first 3 letters + mobile last 4 digits
  const userId =
    name.substring(0, 3).toLowerCase() +
    mobileNo.slice(-4);

  // password = random 8 characters (simple version)
  const password = Math.random().toString(36).slice(-8);

  return { userId, password };
}

module.exports = generateCredentials;
