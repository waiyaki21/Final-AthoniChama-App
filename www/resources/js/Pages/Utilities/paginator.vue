<template>
    <!-- <nav aria-label="Page navigation example" class="w-full inline-flex justify-center mx-auto">
      <ul class="flex items-center -space-x-px h-10 text-base my-4">
        <li v-for="link in links">
          <a 
            :href="link.url" 
            class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mx-2" 
            v-html="link.label" 
            :class="{ 'text-gray-500': !link.url, 'cursor-not-allowed': link.active }">
          </a>
        </li>
      </ul>
    </nav> -->

    <!-- <paginator
        :links = classInfo.links
    ></paginator> -->
</template>

<script>
    export default {
        props: {
            links: Array
        }
    }
</script>