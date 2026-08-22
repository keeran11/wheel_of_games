const GAMES = {
  names: {
    key: 'names',
    title: 'Wheel of Names',
    subtitle: 'Enter names, spin the wheel, pick a random winner!',
    itemSingular: 'name',
    itemPlural: 'names',
    storage: {
      entries: 'wheelEntries',
      colors: 'wheelColors',
      spinHistory: 'spinHistory'
    }
  },
  gifts: {
    key: 'gifts',
    title: 'Wheel of Gifts',
    subtitle: 'Enter gifts, spin the wheel, pick a random winner!',
    itemSingular: 'gift',
    itemPlural: 'gifts',
    storage: {
      entries: 'giftEntries',
      colors: 'giftColors',
      spinHistory: 'giftSpinHistory'
    }
  }
};

export const getGameConfig = () =>
  window.location.pathname.includes('wheelofgift')
    ? GAMES.gifts
    : GAMES.names;
