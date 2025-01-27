// Pages/Globals/flashMessages.js
import { nextTick } from 'vue';
import eventBus     from './eventBus'; // Adjust the path to your eventBus
import { router }   from '@inertiajs/vue3';


// .................FLASH CONTROLS
// Emit flash show message
export const flashShow = (info, type) => {
    flashHide();
    nextTick(() => {
        eventBus.emit('flashShow', { info, type });
    });
};

// Emit flash loading message
export const flashLoading = (message = 'Loading! Please Wait') => {
    const info = message; // Default message is already handled by the parameter
    const type = 'loading';
    const time = 10000;

    // Emit the event with the required data
    eventBus.emit('flashTimed', { info, type, time });
};

// Emit a timed flash message
export const flashTimed = (info, type, duration) => {
    eventBus.emit('flashTimed', { info, type, duration });
};

// Emit a flash view message
export const flashShowView = (message, body, header, url, button, duration, linkState) => {
    // console.log(message, body, header, url, button, duration, linkState);
    
    eventBus.emit('flashView', { message, body, header, url, button, duration, linkState });
};

// Emit flash hide message
export const flashHide = () => {
    eventBus.emit('flashHide');
};

// Emit flash all hide message
export const flashAllHide = () => {
    eventBus.emit('flashAllHide');
};
// .................FLASH CONTROLS

// .................RELOADS 
// Emit reload Side Nav
export const reloadNav = () => {
    eventBus.emit('reloadNav');
};

// Emit reload Members
export const reloadMembers = () => {
    eventBus.emit('reloadNav');
    eventBus.emit('reloadMembers');
};

// Emit reload Cycles
export const reloadCycles = () => {
    eventBus.emit('reloadNav');
    eventBus.emit('reloadCycles');
};

// Emit reload Page
export const reloadPage = () => {
    eventBus.emit('reloadPage');
    eventBus.emit('reloadNav');
};
// .................RELOADS

// .................DOWNLOAD TEMPLATES
// members Template EMPTY
export const membersTemp = () => {
    eventBus.emit('membersTemplate');
};
// preset LATEST SEPT 2024
export const presetMembers = () => {
    eventBus.emit('presetMembersTemplate');
};
// preset LATEST SEPT 2024
export const presetCycles = () => {
    eventBus.emit('presetCyclesTemplate');
};
// .................DOWNLOAD TEMPLATES

// scroll to top 
export const scrollToClass = () => {
    const element = document.querySelector(`.mainBody`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// goto Route 
export const gotoRoute = (url) => {
    // router 
    router.get(url);
}