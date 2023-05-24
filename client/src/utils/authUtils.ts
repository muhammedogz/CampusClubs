import {
  createPKCEHelper,
  PKCEChallenge,
  PKCEHelperLegacyBrowser,
} from 'simple-pkce-browser';

const VERIFIER_LENGTH = 64;

const RESPONSE_TYPE = 'code';
const CLIENT_ID = '88AD669CED46431AB77DAD88309327F5';
const REDIRECT_URI = 'https://ogrenciprojeleri.gtu.edu.tr/KulupYonetim/router';
const CODE_CHALLENGE_METHOD = 'S256';

const generateState = () => {
  const rand = Math.random().toString(36).substring(2, 15);
  return rand + rand;
};

// https://kampus.gtu.edu.tr/oauth/yetki?response_type=code&client_id=xxxxx
// &redirect_uri=https://uygulama.gtu.edu.tr/login/oauthredirect&state=random_value&
// code_challenge_method=s256&code_challange=xxxxxxxxxx

export const generateRedirectUrl = () => {
  const { generateChallenge }: PKCEHelperLegacyBrowser =
    createPKCEHelper(false);
  const { verifier, challenge }: PKCEChallenge =
    generateChallenge(VERIFIER_LENGTH);

  const state = generateState();

  const code_challenge = challenge;

  const url = `https://kampus.gtu.edu.tr/oauth/yetki?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&code_challenge_method=${CODE_CHALLENGE_METHOD}&code_challenge=${code_challenge}`;

  return { url, code_verifier: verifier, state };
};
