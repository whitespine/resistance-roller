/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleId: string, moduleLabel: string}}
 */
export const constants = {
   moduleId: 'resistance-roller',
   moduleLabel: `Resistance Roller`,
   socketName: "module.resistance-roller",
   defaultMaxResistance: 5
};

/**
 * @type {ESSessionConstants} Defines all the module session storage static constants.
 */
export const sessionConstants = {
   themeDarkMode: `${constants.moduleId}.theme.dark`
};
