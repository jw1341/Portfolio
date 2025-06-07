import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 1, username: 'testuser' },  // payload
  '6bd0e20396a93bd29da98845f47eee73cc17eaedd00860ffeb7007f5d17d299d4b80292a31c8a25560d0f0f74fca4c6b5b956d3e4cfa61cf0341f03c10a398be6244e9b8faeae4c574923e20a711d1fc27944f5ef76791d8c19104842a99933adf1d7df7fa3914601b03f47d588331e5be4cccefd2635ba4b153fff27eed84076ee74d2faaa1dd926e0f26a0e2320ea0fd63d1e54b9f2299341fcaf0b1170b6dee56574a5d590c993e471d2208381a388dc5460767e1be1e3be86e353f3a3208165d16cb1fc21643427a20180d45c8144462282dd3193f3a203a640d1b93be9c1e84adf06a838a677ade546042ef0b3a9c13ad2a74c9d3932c8c60457ff83b33',                   // same secret you use in your app
  { expiresIn: '1h' }
);

console.log(token);
