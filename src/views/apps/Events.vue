<template>
  <EventsApp1></EventsApp1>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import EventsApp1 from "@/components/events/EventsApp.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";

export default defineComponent({
  name: "calendar",
  components: {
    EventsApp1,
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Events", []);
    });
  },
});
</script>
