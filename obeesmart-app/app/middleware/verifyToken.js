const express = require('express');
const jwt = require('jsonwebtoken');
const Models = require('../models');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify if the token exists in the database
    const foundToken = await Models.Token.findOne({
      where: { token },
    });

    if (!foundToken || (foundToken.expires && foundToken.expires <= new Date())) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // If the token is valid, decode and attach the payload to the request
    const decoded = jwt.decode(token, { complete: true });
    req.decoded = decoded.payload;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = verifyToken;