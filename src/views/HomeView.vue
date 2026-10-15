<script setup lang="ts">
import EntryGate from '@/components/home/EntryGate.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeIntro from '@/components/home/HomeIntro.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import HomeServices from '@/components/home/HomeServices.vue'
import HomeSteps from '@/components/home/HomeSteps.vue'
import HomeFeatured from '@/components/home/HomeFeatured.vue'
import HomeCatalogs from '@/components/home/HomeCatalogs.vue'
import HomeBigline from '@/components/home/HomeBigline.vue'
import HomeVisit from '@/components/home/HomeVisit.vue'
import HomeContact from '@/components/home/HomeContact.vue'
</script>

<template>
  <div class="home">
    <EntryGate />
    <HomeHero />
    <HomeIntro />
    <HomeMarquee />
    <HomeServices />
    <HomeSteps />
    <HomeFeatured />
    <HomeCatalogs />
    <HomeBigline />
    <HomeVisit />
    <HomeContact />
  </div>
</template>

<style scoped lang="scss">
.home {
  // Nada se sale por los costados aunque las pelotas y la cinta sean más anchas.
  overflow-x: clip;
}
</style>
