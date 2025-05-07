export const cssOverrides = `
:host,
body {
  --dynamic-text-link: #4597f5 !important;
  --dynamic-brand-primary-color: #4597f5 !important;
  --dynamic-text-primary: #000 !important;
  --dynamic-text-secondary: #52514f !important;
}

/* Containers */

:root .modal,
.accordion-item,
.confirm-connection,
.wallet-connected {
  border-radius: 0;
  background:
    radial-gradient(
      168.59% 77.78% at 2.27% 0%,
      rgba(158, 143, 255, 0.36) 0%,
      rgba(255, 255, 255, 0) 34%
    ),
    radial-gradient(
      166.26% 67.67% at 78.44% 0%,
      rgba(132, 197, 254, 0.36) 0%,
      rgba(255, 255, 255, 0) 34%
    ),
    #faf7f5;
}

.modal-card {
  background: none;
}

:root .modal-card--sharp-mobile-bottom-radius:last-child {
  border-radius: 0;
}

.modal-frame__modal,
:root .modal-card {
  height: 100%;
  width: 100%;
  border-radius: 0;
}

:root .modal,
.confirm-connection,
.wallet-connected {
  width: 100%;
  height: 100%;
  max-width: 420px;
  max-height: 640px !important;
  overflow: hidden;
}

.accordion-item--full-height {
  width: 100%;
  height: 100%;
  max-width: 420px;
  overflow: hidden;
}

@media (min-width: 421px) {
  :root .modal,
  .accordion-item--full-height,
  .confirm-connection,
  .wallet-connected {
    border-radius: 16px;
    box-shadow:
      0px 2px 4px 0px rgba(0, 0, 0, 0.04),
      0px 12px 24px 0px rgba(0, 0, 0, 0.08);
  }

  .multi-asset-balance-container__accordion {
    box-shadow: none;
    border-radius: 0;
  }
}

.multi-asset-balance-container__accordion {
    background: none;
}

.vertical-accordion__container {
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.embedded-widget {
  height: 100%;
  width: 100%;
}

.profile-view,
.settings-view,
.account-and-security-settings-view {
  background:
    radial-gradient(
      168.59% 77.78% at 2.27% 0%,
      rgba(158, 143, 255, 0.36) 0%,
      rgba(255, 255, 255, 0) 34%
    ),
    radial-gradient(
      166.26% 67.67% at 78.44% 0%,
      rgba(132, 197, 254, 0.36) 0%,
      rgba(255, 255, 255, 0) 34%
    ),
    #faf7f5;
}

.login-view__scroll {
  gap: 0.75rem;
}

.login-with-email-form {
  gap: 0.75rem;
}

.user-profile__fields,
.user-profile__social-accounts {
  gap: 0.75rem;
}

/* Wallet settings */

.footer-options-switcher__container {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

/* Inputs */

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

.input__container .input:not(.input__error, .input__success):hover {
  border-radius: 8px;
  border: 2px solid transparent;
  outline: 2px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

.input__container .input:not(.input__error, .input__success):focus {
  border-radius: 8px;
  border: 2px solid transparent;
  outline: 2px solid #9dc1e0;
  background: rgba(255, 255, 255, 0.96);
}

.input__container--dense .input:focus ~ .input__label {
  font-size: 0.625rem;
  top: 0.4375rem;
}

.phone-number-field__fields__country-code
  .phone-number-field__fields__country-code__container
  .phone-number-field__fields__country-code__container__input,
.phone-number-field__fields
  .phone-number-field__fields__phone-number
  .phone-number-field__fields__phone-number__input {
  outline: none !important;
}

.input__container--dense .input__label,
.input__container--dense .input:placeholder-shown ~ .input__label {
  left: 1rem;
  top: 1rem;
}

.input__container--dense .input:focus ~ .input__label {
  top: 0.4375rem;
}

/* Misc */
.list-tile {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  opacity: 0.82;
  background: rgba(255, 255, 255, 0.96);
}

.list-tile:not(:disabled):hover {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

/* Buttons */
.button--brand-primary {
  border-radius: 60px;
  border: 2px solid #ccb0f5;
  color: #253747;
  background: linear-gradient(72deg, #ccb0f5 12%, #cce4ff 72.12%);
}

.button--brand-primary:hover {
  border: 2px solid #cce4ff;
  box-shadow: 0px 2px 4px -2px rgba(15, 14, 13, 0.2);
}

.button--brand-primary:disabled:not(.button--loading) {
  border: 2px solid rgba(15, 14, 13, 0.08);
  background: #fff;
  color: rgba(204, 202, 200, 1);
}

.button--primary {
  border-radius: 60px;
  background: white;
  border: 2px solid #9e8fff;
  color: #253747;
}

.button--primary:hover {
  background:
    linear-gradient(
      0deg,
      rgba(15, 14, 13, 0.04) 0%,
      rgba(15, 14, 13, 0.04) 100%
    ),
    #fff;
  box-shadow: 0px 2px 4px -2px rgba(15, 14, 13, 0.2);
}

.button--primary:disabled:not(.button--loading) {
  border: 2px solid rgba(15, 14, 13, 0.08);
  background: #fff;
  color: rgba(204, 202, 200, 1);
}

.button--padding-medium,
.button--padding-large {
  border-radius: 60px;
}

.transaction-confirmation__actions .button--brand-primary .typography--primary,
.transaction-confirmation__actions
  .button--brand-primary
  .icon--color-text-secondary {
  color: #253747;
}

/* footer */
.powered-by-dynamic {
  align-items: center;
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

.footer-options-switcher__tab--active {
  color: var(--dynamic-brand-primary-color);
}

.footer-options-switcher__tab--active .footer-options-switcher__label {
  color: var(--dynamic-brand-primary-color);
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
