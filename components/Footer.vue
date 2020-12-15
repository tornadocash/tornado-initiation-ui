<template>
  <footer class="footer">
    <div class="container">
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item is-column">
            <div class="level-subitem">
              <div class="buttons">
                <b-button
                  tag="a"
                  type="is-icon"
                  href="https://explore.duneanalytics.com/public/dashboards/UEU02CHiGtNw9crfeD6OJ7bKPnvFtNjOgZ7Vc6uj"
                  target="_blank"
                  icon-right="stats"
                ></b-button>
                <b-button
                  tag="a"
                  type="is-icon"
                  href="https://twitter.com/TornadoCash"
                  target="_blank"
                  icon-right="twitter"
                ></b-button>
                <b-button
                  tag="a"
                  type="is-icon"
                  href="https://t.me/TornadoCashOfficial"
                  target="_blank"
                  icon-right="telegram"
                ></b-button>
                <b-button
                  tag="a"
                  type="is-icon"
                  href="https://github.com/tornadocash"
                  target="_blank"
                  icon-right="github"
                ></b-button>
                <div class="break"></div>
                <b-dropdown
                  v-model="$i18n.locale"
                  class="dropdown-langs"
                  position="is-top-left"
                  aria-role="list"
                  @change="langChange"
                >
                  <b-button slot="trigger" type="is-icon">
                    <FlagIcon
                      :code="$i18n.locale"
                      :class="'is-active-locale-' + $i18n.locale"
                    />
                  </b-button>

                  <b-dropdown-item
                    v-for="locale in locales"
                    :key="locale"
                    :value="locale"
                    aria-role="listitem"
                  >
                    <FlagIcon :code="locale" />
                    {{ printLang(locale) }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { FlagIcon } from '@/components/icons'

export default {
  components: {
    FlagIcon,
  },
  computed: {
    locales() {
      return this.$i18n.availableLocales
    },
  },
  methods: {
    langChange(lang) {
      localStorage.setItem('lang', lang)

      if (lang === 'zh') {
        lang += '-cn'
      }

      // this.$moment.locale(lang)
    },
    printLang(lang) {
      let code = lang
      switch (code) {
        case 'zh':
          code = 'cn'
          break
      }
      return code.toUpperCase()
    },
  },
}
</script>
