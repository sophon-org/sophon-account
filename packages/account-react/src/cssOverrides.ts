export const cssOverrides = `
:host {
  --dynamic-text-link: #4597F5 !important;
  --dynamic-brand-primary-color: #4597F5 !important;
  --dynamic-text-primary: #000 !important;
  --dynamic-text-secondary: #52514F !important;
}

.modal-card {
  border-radius: 16px;
  background: radial-gradient(168.59% 77.78% at 2.27% 0%, rgba(158, 143, 255, 0.36) 0%, rgba(255, 255, 255, 0.00) 34%), radial-gradient(166.26% 67.67% at 78.44% 0%, rgba(132, 197, 254, 0.36) 0%, rgba(255, 255, 255, 0.00) 34%), #FAF7F5;
}

.profile-view, .settings-view, .account-and-security-settings-view {
  background: radial-gradient(168.59% 77.78% at 2.27% 0%, rgba(158, 143, 255, 0.36) 0%, rgba(255, 255, 255, 0.00) 34%), radial-gradient(166.26% 67.67% at 78.44% 0%, rgba(132, 197, 254, 0.36) 0%, rgba(255, 255, 255, 0.00) 34%), #FAF7F5;
}

.footer-options-switcher__container {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.login-view__scroll {
  gap: 0.75rem;
}

.login-with-email-form {
  gap: 0.75rem;
}

.input__container {
  display: flex;
}

.input__container .input {
  border-radius: 8px;
  border: 2px solid transparent;
  outline: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.96);
  color: #000;
  margin: 2px;
  flex: 1;
  width: auto;
}

.input__container .input:not(.input__error,.input__success):hover {
  border-radius: 8px;
  border: 2px solid transparent;
  outline: 2px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

.input__container .input:not(.input__error,.input__success):focus {
  border-radius: 8px;
  border: 2px solid transparent;
  outline: 2px solid #9DC1E0;
  background: rgba(255, 255, 255, 0.96);
}

.phone-number-field__fields__country-code .phone-number-field__fields__country-code__container .phone-number-field__fields__country-code__container__input, .phone-number-field__fields .phone-number-field__fields__phone-number .phone-number-field__fields__phone-number__input {
  outline: none !important;
}

.input__container--dense .input:placeholder-shown~.input__label {
  top: 1rem;
}

.list-tile {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  opacity: 0.82;
  background:  rgba(255, 255, 255, 0.96);
}

.list-tile:not(:disabled):hover {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

.button--primary, .button--brand-primary {
  border-radius: 144px;
  background: white;  
  border: 2px solid #9E8FFF;
  color: #253747;
}

.button--primary:hover, .button--brand-primary:hover {
  background: linear-gradient(0deg, rgba(15, 14, 13, 0.04) 0%,  rgba(15, 14, 13, 0.04) 100%), #FFF;
  box-shadow: 0px 2px 4px -2px rgba(15, 14, 13, 0.20);
}

.button--primary:disabled:not(.button--loading), .button--brand-primary:disabled:not(.button--loading)  {
  border: 2px solid rgba(15, 14, 13, 0.08);
  background: #FFF;
  color: rgba(204, 202, 200, 1);
}

.button--padding-medium, .button--padding-large {
  border-radius: 144px;
}

.footer-options-switcher__tab--active {
  color: var(--dynamic-brand-primary-color);
}

.footer-options-switcher__tab--active .footer-options-switcher__label {
  color: var(--dynamic-brand-primary-color);
}

.user-profile__fields, .user-profile__social-accounts {
  gap: 0.75rem;
}

.powered-by-dynamic {
  align-items: unset;
}

.powered-by-dynamic a {
  cursor: default;
  pointer-events: none;
}

.powered-by-dynamic svg {
  display: none;
}

.powered-by-dynamic:after {
  content: "Sophon";
  font-size: 12px;
  font-weight: 700;
}

.dynamic-footer {
  display: block !important;
} 
`;

export const hideWalletOperationsStyle = `
.dynamic-widget-wallet-header__wallet-info {
  padding-bottom: 0px !important;
}
.dynamic-widget-wallet-header__wallet-actions {
  display: none;
}
.account-and-security-settings-view__delete-account-container, .settings-view__delete-account-container {
  display: none !important;
}
`;
