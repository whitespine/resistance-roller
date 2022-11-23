/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleId: string, moduleLabel: string}}
 */
const constants = {
   moduleId: 'resistance-roller',
   moduleLabel: `Resistance Roller`
};

/**
 * @type {ESSessionConstants} Defines all the module session storage static constants.
 */
const sessionConstants = {
   themeDarkMode: `${constants.moduleId}.theme.dark`
};

export { constants, sessionConstants };
