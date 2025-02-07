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
// show All Members
export const showAllMembers = () => {
    eventBus.emit('showAllMembers');
};
// .................DOWNLOAD TEMPLATES

// scroll to top 
export const scrollToClass = () => {
    const element = document.querySelector(`.mainBody`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll to the top of a specific class or element
export const scrollToToggle = (selector = '.topToggle') => {
    const element = document.querySelector(selector);
    if (element) {
        // Get the element's position relative to the viewport
        const rect = element.getBoundingClientRect();
        const offset = window.pageYOffset || document.documentElement.scrollTop;

        // Scroll to the calculated position (200px above the element)
        window.scrollTo({
            top: rect.top + offset - 50, // Subtract 200px
            behavior: 'smooth',
        });
    } else {
        console.warn(`Element with class ".${selector}" not found.`);
    }
};

// goto Route 
export const gotoRoute = (url) => {
    // router 
    router.get(url);
}

// plural check
export const pluralCheck = (count, name) => {
    if (count == 1) {
        let text = `${name}`;
        return text;
    } else {
        let text = `${name}s`;
        return text;
    }
}