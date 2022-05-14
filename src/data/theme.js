import Dashboard from "./../containers/dashboards/Dashboard";
import MusicDashboard from "./../containers/dashboards/MusicDashboard/index";

import WindowDecorator from "../components/WindowDecorator";
import MusicDecorator from "./../containers/dashboards/decorators/MusicDecorator";

export const THEMES = {
    COLORIZED: 'colorized',
    MUSIC: 'music'
}

const themes = {
    [THEMES.COLORIZED]: {
        dashboard: Dashboard,
        decorator: WindowDecorator
    },
    [THEMES.MUSIC]: {
        dashboard: MusicDashboard,
        decorator: MusicDecorator
    }
}

export const defaultTheme = THEMES.MUSIC;

export default themes;