/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
^^^ this comment above is required by the fucking auto formatter
fuck you auto formatter



Welcome to the worst file in this entire client mod.
This is the jankiest mess ever created.
This file is the root of hell.
It controls ALL modifications done to make the UI for mobile.
Like, holy fucking shit.
GLHF, I'm not

- Written in despair, Jae

*/

import "./theme.css";

import { getUserSettingLazy } from "@api/UserSettings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";

const Button = findComponentByCodeLazy("Button.Sizes.NONE,disabled:");

const ShowCurrentGame = getUserSettingLazy<boolean>("status", "showCurrentGame")!;

function makeIcon(showCurrentGame?: boolean) {
    const oldIcon = false;

    const redLinePath = !oldIcon
        ? "M22.7 2.7a1 1 0 0 0-1.4-1.4l-20 20a1 1 0 1 0 1.4 1.4Z"
        : "M23 2.27 21.73 1 1 21.73 2.27 23 23 2.27Z";

    const maskBlackPath = !oldIcon
        ? "M23.27 4.73 19.27 .73 -.27 20.27 3.73 24.27Z"
        : "M23.27 4.54 19.46.73 .73 19.46 4.54 23.27 23.27 4.54Z";

    return function () {
        return (
            <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                    fill={!showCurrentGame && !oldIcon ? "var(--status-danger)" : "currentColor"}
                    mask={!showCurrentGame ? "url(#gameActivityMask)" : void 0}
                    d="M3.06 20.4q-1.53 0-2.37-1.065T.06 16.74l1.26-9q.27-1.8 1.605-2.97T6.06 3.6h11.88q1.8 0 3.135 1.17t1.605 2.97l1.26 9q.21 1.53-.63 2.595T20.94 20.4q-.63 0-1.17-.225T18.78 19.5l-2.7-2.7H7.92l-2.7 2.7q-.45.45-.99.675t-1.17.225Zm14.94-7.2q.51 0 .855-.345T19.2 12q0-.51-.345-.855T18 10.8q-.51 0-.855.345T16.8 12q0 .51.345 .855T18 13.2Zm-2.4-3.6q.51 0 .855-.345T16.8 8.4q0-.51-.345-.855T15.6 7.2q-.51 0-.855.345T14.4 8.4q0 .51.345 .855T15.6 9.6ZM6.9 13.2h1.8v-2.1h2.1v-1.8h-2.1v-2.1h-1.8v2.1h-2.1v1.8h2.1v2.1Z"
                />
                {!showCurrentGame && <>
                    <path fill="var(--status-danger)" d={redLinePath} />
                    <mask id="gameActivityMask">
                        <rect fill="white" x="0" y="0" width="24" height="24" />
                        <path fill="black" d={maskBlackPath} />
                    </mask>
                </>}
            </svg>
        );
    };
}

function GameActivityToggleButton() {
    const showCurrentGame = ShowCurrentGame.useSetting();

    return (
        <Button
            tooltipText={showCurrentGame ? "Disable Game Activity" : "Enable Game Activity"}
            icon={makeIcon(showCurrentGame)}
            role="switch"
            aria-checked={!showCurrentGame}
            onClick={() => ShowCurrentGame.updateSetting(old => !old)}
        />
    );
}

export default definePlugin({
    name: "MobileUI",
    description: "Changes the desktop Discord UI to be like mobile.",
    required: true,
    nexulien: true,
    authors: [Devs.Jaegerwald],

    patches: [
        {
            find: "#{intl::ACCOUNT_SPEAKING_WHILE_MUTED}",
            replacement: {
                match: /this\.renderNameZone\(\).+?children:\[/,
                replace: "$&$self.GameActivityToggleButton(),"
            }
        }
    ],

    GameActivityToggleButton: ErrorBoundary.wrap(GameActivityToggleButton, { noop: true }),

    start() {
        document.querySelectorAll("#app-mount > div.appAsidePanelWrapper_bd26cc.mobileAppAsidePanelWrapper_bd26cc > div.container_d69a57").forEach(element => {
            element.remove();
        });

        const profileButton: HTMLElement | null = document.querySelector(".panels_a4d4d9>.container_b2ca13>.avatarWrapper_b2ca13");
        const settingsButton: HTMLElement | null = document.querySelector(".panels_a4d4d9>.container_b2ca13>.flex_dc333f>*:nth-last-child(2)");
        profileButton?.addEventListener("click", function () {
            console.log("BITCH");
            (settingsButton as HTMLElement).click();
        });
    }
});
