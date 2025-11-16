// Validation helpers for serverless functions

const validateSteamId = (steamId) => {
  if (!steamId) return 'Steam ID is required';
  if (typeof steamId !== 'string') return 'Steam ID must be a string';
  if (!/^steam:[a-fA-F0-9]+$/.test(steamId)) return 'Invalid Steam ID format (must be steam:hexadecimal)';
  return null;
};

const validateDiscordId = (discordId) => {
  if (!discordId) return 'Discord ID is required';
  if (typeof discordId !== 'string') return 'Discord ID must be a string';
  return null;
};

const validateReason = (reason) => {
  if (!reason) return 'Reason is required';
  if (typeof reason !== 'string') return 'Reason must be a string';
  if (reason.trim().length < 10) return 'Reason must be at least 10 characters';
  if (reason.length > 1000) return 'Reason must not exceed 1000 characters';
  return null;
};

const validateCheatName = (cheatName) => {
  if (cheatName && cheatName.length > 200) {
    return 'Cheat name must not exceed 200 characters';
  }
  return null;
};

const validateUrl = (url, fieldName = 'URL') => {
  if (!url) return null; // Optional field
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} must be a valid URL`;
  }
};

const validateClownData = (data) => {
  const errors = [];

  const steamIdError = validateSteamId(data.steamId);
  if (steamIdError) errors.push({ field: 'steamId', message: steamIdError });

  const discordIdError = validateDiscordId(data.discordId);
  if (discordIdError) errors.push({ field: 'discordId', message: discordIdError });

  const reasonError = validateReason(data.reason);
  if (reasonError) errors.push({ field: 'reason', message: reasonError });

  const cheatNameError = validateCheatName(data.cheatName);
  if (cheatNameError) errors.push({ field: 'cheatName', message: cheatNameError });

  const proofUrlError = validateUrl(data.proofUrl, 'Proof URL');
  if (proofUrlError) errors.push({ field: 'proofUrl', message: proofUrlError });

  const steamProfileUrlError = validateUrl(data.steamProfileUrl, 'Steam Profile URL');
  if (steamProfileUrlError) errors.push({ field: 'steamProfileUrl', message: steamProfileUrlError });

  return errors;
};

const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

const validateLoginData = (data) => {
  const errors = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return errors;
};

module.exports = {
  validateClownData,
  validateLoginData,
  validateSteamId,
  validateDiscordId,
  validateReason,
  validateEmail,
  validatePassword,
};

