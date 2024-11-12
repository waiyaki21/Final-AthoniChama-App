<template>
    <section ref="flashContainer"
        class="fixed top-[1rem] right-5 flex-col z-[141] boldened overflow-y-scroll hidescroll max-h-[90%]"
        v-if="this.show">
        <TransitionGroup name="list" tag="div">
            <div v-for="flash in flashes" class="my-0.5 bg-transparent dark:bg-transparent pl-0.5 py-0.5 rounded-l-lg"
                :key="flash">
                <!-- button flash  -->
                <div :class="[this.flashButton, flash.class, { 'animate__animated animate__fadeInDown': !flash.isHiding, 'animate__animated animate__zoomOut': flash.isHiding }]"
                    role="alert" v-if="flash.click" @click="hide(flash.id)" @animationend="handleAnimationEnd">
                    <!-- header  -->
                    <div class="inline-flex w-full justify-start gap-2">
                        <!-- icons  -->
                        <component :is="flash.icon" :class="flash.iconClass" v-if="flash.icon"></component>

                        <!-- header  -->
                        <span class="sr-only">Info</span>
                        <h3 class="text-sm md:text-md font-medium uppercase underline">{{ flash.header }}</h3>
                    </div>
                    <!-- body  -->
                    <div class="font-sans font-semibold my-2 text-xs w-full text-left">
                        {{ flash.body }}
                    </div>
                    <!-- close  -->
                    <div class="inline-flex w-full justify-between gap-1">
                        <ActionButton :buttonClass="'dark'" :tooltipText="flash.urlLink ? `Go to link`: `Download File`" :buttonText="`${flash.button}`" class="rounded-md shadow-md w-full" @handleClick="flash.urlLink ? $goTo(flash.link) : $downloadFile(flash.link)">
                            <right-icon class="mx-2 w-4 h-4 md:w-5 md:h-5 hover:rotate-180"></right-icon>
                        </ActionButton>
                        <StyleButton :buttonClass="'danger'" :tooltipText="`Close Notification`" :buttonText="`Close`"
                            class="rounded-md shadow-md text-black flex-shrink-0" @handleClick="hide(flash.id)">
                            <times-icon class="m-1 w-4 h-4 md:w-5 md:h-5"></times-icon>
                        </StyleButton>
                    </div>
                </div>
                <!-- regular flash  -->
                <div :class="[this.flashNorm, flash.class, { 'animate__animated animate__fadeInDown': !flash.isHiding,'animate__animated animate__zoomOut': flash.isHiding }]"
                    role="alert" v-if="!flash.click" @click="hide(flash.id)" @animationend="handleAnimationEnd">
                    <!-- icons  -->
                    <component :is="flash.icon" :class="flash.iconClass" v-if="flash.icon"></component>
                    <!-- body  -->
                    <div :class="['ms-1 md:ms-3 text-sm md:text-[0.9rem] font-normal boldened', flash.text]">
                        {{ flash.body }}
                    </div>
                    <!-- close  -->
                    <button type="button"
                        :class="['ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-1 p-1.5 inline-flex items-center justify-center w-5 h-5 md:w-8 md:h-8',flash.text]"
                        @click="hide(flash.id)">
                        <times-icon class="w-3 h-3"></times-icon>
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </section>
</template>
       
<script>
    export default {
        props: [
            'message'
        ],

        data() {
            return {
                show        : false,
                body        : 'Test Sent successfully.',
                classType   : '',
                textClass   : '',
                type        : '',

                flashButton: 'flex-col gap-1 items-center p-2 py-3 border rounded-md shadow-md cursor-pointer w-[17rem] md:w-[22.5rem]',
                flashNorm:   'flex items-center p-2 py-3 border rounded-md shadow-md cursor-pointer w-[17rem] md:w-[22.5rem]',

                success     : false,
                info        : false,
                warning     : false,
                danger      : false,
                click       : false,

                flashes: [],  // Array to store flash messages
                nextFlashId: 1,

                classConfig: {
                    success: {
                        icon: 'bell-icon',
                        textClass: 'bg-emerald-50 text-emerald-500 focus:ring-emerald-200 dark:bg-emerald-800 dark:text-emerald-200',
                        classType: 'text-emerald-800 border-emerald-300 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-800 dark:border-emerald-800',
                        success: true
                    },
                    info: {
                        icon: 'info-icon',
                        textClass: 'bg-blue-50 text-blue-500 focus:ring-blue-200 dark:bg-blue-800 dark:text-blue-200',
                        classType: 'text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-200 dark:bg-blue-800 dark:border-blue-800',
                        info: true
                    },
                    sky: {
                        icon: 'info-icon',
                        textClass: 'bg-sky-50 text-sky-500 focus:ring-sky-200 dark:bg-sky-800 dark:text-sky-200',
                        classType: 'text-sky-800 border-sky-300 bg-sky-50 dark:text-sky-200 dark:bg-sky-800 dark:border-sky-800',
                        info: true
                    },
                    danger: {
                        icon: 'warning-icon',
                        textClass: 'bg-rose-50 text-rose-500 focus:ring-rose-200 dark:bg-red-800 dark:text-rose-200',
                        classType: 'text-red-800 border-red-300 bg-red-50 dark:text-red-200 dark:bg-red-800 dark:border-red-800',
                        danger: true
                    },
                    delete: {
                        icon: 'delete-icon',
                        textClass: 'bg-rose-50 text-rose-500 focus:ring-rose-200 dark:bg-red-800 dark:text-rose-200',
                        classType: 'text-red-800 border-red-300 bg-red-50 dark:text-red-200 dark:bg-red-800 dark:border-red-800',
                        danger: true
                    },
                    warn: {
                        icon: 'stop-icon',
                        textClass: 'bg-orange-50 text-orange-500 focus:ring-orange-200 dark:bg-orange-600 dark:text-orange-200',
                        classType: 'text-orange-800 border-orange-300 bg-orange-50 dark:text-orange-200 dark:bg-orange-600 dark:border-orange-600',
                        danger: true
                    },
                    ledger: {
                        icon: 'calendar-icon',
                        textClass: 'bg-pink-50 text-pink-500 focus:ring-pink-200 dark:bg-pink-800 dark:text-pink-200',
                        classType: 'text-pink-800 border-pink-300 bg-pink-50 dark:text-pink-200 dark:bg-pink-800 dark:border-pink-800',
                        info: true
                    },
                    reload: {
                        icon: 'clock-icon',
                        textClass: 'bg-yellow-50 text-yellow-900 focus:ring-yellow-200 dark:bg-transparent dark:text-gray-900',
                        classType: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-gray-900 dark:bg-yellow-400 dark:border-yellow-200',
                        warning: true
                    },
                    warning: {
                        icon: 'warning-icon',
                        textClass: 'bg-yellow-50 text-yellow-900 focus:ring-yellow-200 dark:bg-transparent dark:text-gray-900',
                        classType: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-gray-900 dark:bg-yellow-400 dark:border-yellow-200',
                        warning: true
                    },
                    asc: {
                        icon: 'up-arrow',
                        textClass: 'bg-transparent text-white dark:bg-transparent dark:text-white',
                        classType: 'bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 text-white border border-black',
                        warning: true
                    },
                    desc: {
                        icon: 'down-arrow',
                        textClass: 'bg-transparent text-white dark:bg-transparent dark:text-white',
                        classType: 'bg-gradient-to-br from-orange-500 to-pink-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800 text-white border border-black',
                        warning: true
                    },
                    loading: {
                        icon: 'loading-icon',
                        textClass: 'bg-transparent text-yellow-900 focus:ring-yellow-200 dark:bg-transparent dark:text-gray-900',
                        classType: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-gray-900 dark:bg-yellow-400 dark:border-yellow-200',
                        warning: true
                    },
                    file: {
                        icon: 'document-check',
                        textClass: 'bg-sky-50 text-sky-500 focus:ring-sky-200 dark:bg-sky-800 dark:text-sky-200',
                        classType: 'text-sky-800 border-sky-300 bg-sky-50 dark:text-sky-200 dark:bg-sky-800 dark:border-sky-800',
                        info: true
                    },
                    fileOk: {
                        icon: 'document-check',
                        textClass: 'bg-pink-50 text-pink-500 focus:ring-pink-200 dark:bg-pink-800 dark:text-pink-200',
                        classType: 'text-pink-800 border-pink-300 bg-pink-50 dark:text-pink-200 dark:bg-pink-800 dark:border-pink-800',
                        info: true
                    },
                    newMembers: {
                        icon: 'newmember-icon',
                        textClass: 'bg-slate-50 text-slate-500 focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-200',
                        classType: 'text-slate-800 border-slate-900 bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-100',
                        info: true
                    },
                    members: {
                        icon: 'members-icon',
                        textClass: 'bg-stone-50 text-stone-500 focus:ring-stone-200 dark:bg-stone-800 dark:text-stone-200',
                        classType: 'text-stone-800 border-stone-300 bg-stone-50 dark:text-stone-200 dark:bg-stone-800 dark:border-stone-800',
                        info: true
                    },
                    payments: {
                        icon: 'money-icon',
                        textClass: 'bg-purple-50 text-purple-500 focus:ring-purple-200 dark:bg-purple-800 dark:text-purple-200',
                        classType: 'text-purple-800 border-purple-300 bg-purple-50 dark:text-purple-200 dark:bg-purple-800 dark:border-purple-800',
                        info: true
                    },
                    update: {
                        icon: 'edit-icon',
                        textClass: 'bg-pink-50 text-pink-500 focus:ring-pink-200 dark:bg-pink-800 dark:text-pink-200',
                        classType: 'text-pink-800 border-pink-300 bg-pink-50 dark:text-pink-200 dark:bg-pink-800 dark:border-pink-800',
                        info: true
                    },
                    download: {
                        icon: 'downtray-icon',
                        textClass: 'bg-transparent text-yellow-900 focus:ring-yellow-200 dark:bg-transparent dark:text-gray-900',
                        classType: 'text-yellow-800 border-yellow-900 bg-yellow-50 dark:text-gray-900 dark:bg-yellow-400 dark:border-yellow-50',
                        warning: true
                    },
                    light: {
                        icon: 'light-icon',
                        textClass: 'bg-slate-50 text-slate-900 focus:ring-slate-900',
                        classType: 'text-slate-900 border-slate-900 bg-slate-50',
                        info: true
                    },
                    dark: {
                        icon: 'dark-icon',
                        textClass: 'dark:bg-slate-900 dark:text-slate-100',
                        classType: 'dark:text-slate-100 dark:bg-slate-900 dark:border-slate-100',
                        info: true
                    },
                },
            }
        },

        methods: {
            state() {
                this.success    = false;
                this.info       = false;
                this.warning    = false;
                this.danger     = false;
            },

            scrollDown() {
                // Scroll to the bottom of the flash container
                this.$nextTick(() => {
                    const container = this.$refs.flashContainer;
                    if (container) {
                        container.scrollTop = container.scrollHeight; // Scroll to the bottom
                    }
                });
            },

            toastOn(message) {
                this.state();
                this.setClass(message[1], false);

                // Check if a flash with the same body already exists
                const isDuplicate = this.flashes.some(flash => flash.body === message[0]);

                if (isDuplicate) {
                    // Handle the case where a flash with the same body already exists
                    console.log('Flash with the same body already exists. Not adding a new flash.');
                } else {
                    const newFlash = {
                        id:          this.nextFlashId++,
                        body:        message[0],
                        class:       this.classType,
                        text:        this.textClass,
                        type:        message[1],
                        icon:        this.iconComponent(message[1]),
                        iconClass:   this.iconClass(message[1], this.textClass),
                        click:       false
                    };

                    // Add the new flash message to the flashes array
                    this.flashes.push(newFlash);
                    this.show = true;

                    this.scrollDown();

                    // Show the flash message for 7.5 seconds, then remove it
                    setTimeout(() => {
                        this.flashes = this.flashes.filter(flash => flash.id !== newFlash.id);
                    }, 5000);
                }
            },

            toastOnTime(message) {
                this.state();
                this.setClass(message[1], false);

                // Check if a flash with the same body already exists
                const isDuplicate = this.flashes.some(flash => flash.body === message[0]);

                if (isDuplicate) {
                    // Handle the case where a flash with the same body already exists
                    console.log('Flash with the same body already exists. Not adding a new flash.');
                } else {
                    const newFlash = {
                        id:         this.nextFlashId++,
                        body:       message[0],
                        class:      this.classType,
                        text:       this.textClass,
                        type:       message[1],
                        time:       message[2],
                        icon:       this.iconComponent(message[1]),
                        iconClass:  this.iconClass(message[1], this.textClass),
                        click:      false
                    };

                    // Add the new flash message to the flashes array
                    this.flashes.push(newFlash);
                    this.show = true;

                    this.scrollDown();

                    // Show the flash message for 7.5 seconds, then remove it
                    setTimeout(() => {
                        this.hide(newFlash.id);
                    }, newFlash.time);
                }
            },

            toastClick(message) {
                this.state();

                this.setClass(message[1], true)

                // Check if a flash with the same body already exists
                const isDuplicate = this.flashes.some(flash => flash.body === message[0]);

                if (!isDuplicate) {
                    // create new flash object 
                    const newFlash = {
                        id:         this.nextFlashId++,
                        class:      this.classType,
                        text:       this.textClass,
                        body:       message[0],
                        type:       message[1],
                        header:     message[2],
                        link:       message[3],
                        button:     message[4],
                        duration:   message[5],
                        urlLink:    message[6],
                        icon:       this.iconComponent(message[1]),
                        iconClass:  this.iconClass(message[1], this.textClass),
                        click:      true,
                    };
    
                    // Add the new flash message to the flashes array
                    this.flashes.push(newFlash);
    
                    // show the container 
                    this.show       = true
    
                    this.scrollDown();
    
                    // Show the flash message for 7.5 seconds, then remove it
                    setTimeout(() => {
                        this.hide(newFlash.id);
                    }, newFlash.duration);
                }
            },

            toastEmit(message) {
                this.state();

                this.setClass(message[1], true)

                // create new flash object 
                const newFlash = {
                    id:         this.nextFlashId++,
                    class:      this.classType,
                    text:       this.textClass,
                    body:       message[0],
                    type:       message[1],
                    header:     message[2],
                    link:       message[3],
                    button:     message[4],
                    duration:   message[5],
                    icon:       this.iconComponent(message[1]),
                    iconClass:  this.iconClass(message[1], this.textClass),
                    click:      true,
                    emit:       true
                };

                // Add the new flash message to the flashes array
                this.flashes.push(newFlash);

                // show the container 
                this.show       = true;

                this.scrollDown();

                // Show the flash message for 7.5 seconds, then remove it
                setTimeout(() => {
                    this.hide(newFlash.id);
                }, newFlash.duration);
            },

            emitFlash(flash) {
                if (flash.emit) {
                    this.$emit('info');
                    setTimeout(() => {
                        this.hide(flash.id);                    
                    }, 1500);    
                }
            },

            setClass(info, value) {
                const config = this.classConfig[info];

                if (config) {
                    this.textClass  = config.textClass;
                    this.classType  = config.classType;
                    this.show       = true;
                    this.click      = value;
                    Object.assign(this, config);
                }
            },

            hide(id) {
                this.flashes = this.flashes.filter(flash => flash.id !== id);
                if (this.flashes.length == 0) {
                    this.show = false;    
                }
            },

            hide(flashId) {
                const flash = this.flashes.find(f => f.id === flashId);
                if (flash) {
                    flash.isHiding = true; // Set the flag to true to trigger the exit animation
                }
            },
            handleAnimationEnd() {
                // Remove the flash from the array after the fade-out animation completes
                this.flashes = this.flashes.filter(f => !f.isHiding);
            },

            allHide() {
                this.flashes = [];
                if (this.flashes.length == 0) {
                    this.show = false;    
                }
            }, 

            loadHide() {
                this.loadings = this.flashes.filter(flash => flash.type == 'loading');
                this.loadings.forEach(flash => {
                    this.hide(flash.id)
                });
            },

            iconComponent(type) {
                const config = this.classConfig[type];
                return config ? config.icon : null;
            },

            iconClass(type, text) {
                const baseClass = 'w-4 h-4 md:w-5 md:h-5 mx-0.5 shrink-0';

                if (type === 'loading') {
                    return [baseClass, 'animate-spin', text];
                } else if (type === 'success') {
                    return [baseClass, 'animate__animated animate__swing animate__infinite', text];
                } else if (type === 'warn') {
                    return [baseClass, 'animate-pulse', text];
                } else {
                    return [baseClass, text];
                }
            }
        }
    }
</script>