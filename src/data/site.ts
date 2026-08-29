/**
 * Single source of truth for the strings and URLs that live outside the
 * design: contact details, external destinations, and the two behavioural
 * knobs (popup delay, SMS endpoint).
 *
 * Items marked PLACEHOLDER still need a real value from the client — they are
 * listed in README.md under "Outstanding / needs client input".
 */

export const site = {
  name: 'CULVER&MAIN',
  legalName: 'Culver & Main',
  url: 'https://www.culverandmain.com',
  description:
    'Fresh, locally-inspired California fare in the heart of Downtown Culver City. Breakfast through mid-day, seven days a week.',

  address: {
    street: '3829 Main Street',
    locality: 'Culver City',
    region: 'CA',
    postalCode: '90232',
    country: 'US',
  },

  phone: '424-225-9850',
  email: 'info@culverandmain.com',

  hours: {
    short: 'Open 7 days',
    summary: 'Open 7 days a week',
    times: '8 AM – 3 PM',
    opens: '08:00',
    closes: '15:00',
  },

  parking: {
    address: '3846 Cardiff Avenue',
    note: 'First hour free',
  },

  links: {
    /** Third-party ordering system. Linked, never rebuilt. */
    order: 'https://order.culverandmain.com/',
    /**
     * PLACEHOLDER — the client's Squarespace site has a /parking page whose
     * content has not been handed over, so both parking links resolve to the
     * footer, which carries the address and the free-parking line. Swap this
     * for the real destination once the page exists.
     */
    parking: '#visit',
    /** PLACEHOLDER — real handle not supplied. */
    instagram: 'https://www.instagram.com/',
    /** PLACEHOLDER — careers destination is a mailto until a page exists. */
    careers: 'mailto:info@culverandmain.com?subject=Join%20the%20team',
    media: 'mailto:info@culverandmain.com?subject=Media%20inquiry',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=3829+Main+Street+Culver+City+CA+90232',
  },

  popup: {
    /** Seconds after load before the SMS modal opens. Design default: 2. */
    delaySeconds: 2,
    /** Bump the suffix to re-show the modal to everyone who dismissed it. */
    storageKey: 'cm-sms-popup-dismissed-v1',
  },
} as const;

/**
 * SMS opt-in endpoint. Unset by default — no provider has been chosen.
 * Set PUBLIC_SMS_OPTIN_ENDPOINT at build time to wire the popup form up; it
 * receives `POST {phone: string}` as JSON and is expected to answer 2xx.
 */
export const smsOptInEndpoint: string = import.meta.env.PUBLIC_SMS_OPTIN_ENDPOINT ?? '';
