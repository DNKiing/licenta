'use client';

import {useEffect} from 'react';
import PageTransition from "@/components/PageTransition/PageTransition";

interface AgentProps {
    agentId?: string;
    region?: 'na' | 'eu' | 'ap';
    render?: 'bottom-right' | 'bottom-left' | 'full-width';
    modalMode?: boolean;
    user?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    userID?: string;
    autostart?: boolean;
    customStylesheets?: string[];
}

declare global {
    interface Window {
        VG_CONFIG: any;
    }
}

export default function Agent({
                                  agentId = "D9MQ3ghOFxnS2OSwUqFA",
                                  region = 'na',
                                  render = 'bottom-right',
                                  modalMode,
                                  user,
                                  userID,
                                  autostart,
                                  customStylesheets = [],
                                  iconSize = 60 // Size in pixels, default is 60px
                              }: AgentProps & { iconSize?: number }) {

    useEffect(() => {
        // Ensure container exists in DOM first
        const container = document.getElementById('VG_OVERLAY_CONTAINER');
        if (!container) return;


        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);


        window.VG_CONFIG = {
            ID: agentId,
            region,
            render,
            ...(modalMode && {modalMode}),
            stylesheets: [
                "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css",
                ...customStylesheets
            ],
            ...(user && {user}),
            ...(userID && {userID}),
            ...(autostart && {autostart})
        };


        const existingScript = document.querySelector('script[src="https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js"]');
        if (existingScript) {
            existingScript.remove();
        }


        const script = document.createElement("script");
        script.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
        script.defer = true;


        document.head.appendChild(script);

        // Cleanup function
        return () => {
            // Remove custom styles
            const customStyles = document.querySelector('style');
            if (customStyles && customStyles.textContent?.includes('vg-widget-button')) {
                customStyles.remove();
            }

            // Remove script when component unmounts
            const scriptToRemove = document.querySelector('script[src="https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js"]');
            if (scriptToRemove) {
                scriptToRemove.remove();
            }

            // Clear the config
            if (window.VG_CONFIG) {
                delete window.VG_CONFIG;
            }
        };
    }, [agentId, region, render, modalMode, user, userID, autostart, customStylesheets, iconSize]);

    return (
        <PageTransition>
            <div
                id="VG_OVERLAY_CONTAINER"
                style={{
                    position: 'fixed',
                    zIndex: 9999,
                    pointerEvents: 'auto',
                    ...(render === 'full-width' ? {
                        position: 'relative',
                        width: '100%',
                        height: '500px'
                    } : {})
                }}
            />
        </PageTransition>
    );
}