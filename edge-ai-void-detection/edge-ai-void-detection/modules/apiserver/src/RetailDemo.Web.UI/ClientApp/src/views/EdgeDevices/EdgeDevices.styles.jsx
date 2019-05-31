﻿import { getTheme, classNamesFunction } from "office-ui-fabric-react";

/**
 * If className is defined in baseclasses then use:
 * const globalClassNames = getGlobalClassNames(GlobalClassNames, theme);
*/
const globalClassNames = {
    root: "ms-EdgeDevices",
    title: "ms-EdgeDevices-title",
    edgedevicesContainer: "ms-EdgeDevices-edgedevicesContainer"
};

export const getStyles = props => {
    const { className, styles, theme } = props;

    //const isLargeDown = responsiveMode <= ResponsiveMode.large;
    const isLargeDown = false; // TODO: Implement responsive and this parameter come from that functionality
    // TODO: We need to merge styles (if any) with what's here <- this is under research and current refactoring

    return {
        root: [
            {
                selectors: {
                    ':global(body)': {
                        padding: 0,
                        margin: 0,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        minWidth: '100%',
                        minHeight: '100%',
                        '-webkit-tap-highlight-color': 'transparent'
                    }
                }
            },
            globalClassNames.root,
            className
        ],
        title: [
            theme.fonts.xxLarge,
            {
                marginLeft: 20,
                display: 'inline-block'
            },
            globalClassNames.title
        ],
        edgedevicesContainer: [
            {
                marginTop: 30,
                marginLeft: 20,
                display: 'inline-block'
            },
            globalClassNames.edgedevicesContainer
        ],
        subComponentStyles: {}
    };
};
