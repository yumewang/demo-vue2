<template>
  <div class="hello">
    <h1 class="page-header">{{ msg }}</h1>
    <div :class="[{'vuetable-wrapper ui basic segment table': true}, loading]">
      <vuetable ref="vuetable"
        api-url="http://vuetable.ratiw.net/api/users"
        :fields="fields"
        pagination-path=""
        :sort-order="sortOrder"
        :multi-sort="multiSort"
        :per-page="perPage"
        :append-params="moreParams"
        detail-row-component=""
        detail-row-id="id"
        detail-row-transition="expand"
        row-class-callback="rowClassCB"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:load-success="onLoadSuccess"
        @vuetable:loading="showLoader"
        @vuetable:loaded="hideLoader"
        @vuetable:cell-clicked="onCellClicked"
      ></vuetable>
      <div class="vuetable-pagination ui bottom attached segment grid">
        <vuetable-pagination-info ref="paginationInfo"
          :pagination-info-template="paginationInfoTemplate"
        ></vuetable-pagination-info>
        <component :is="paginationComponent" ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        ></component>
      </div>
    </div>
    <!-- vuetable-wrapper -->
  </div>
</template>
<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationDropdown from 'vuetable-2/src/components/VuetablePaginationDropdown.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'

let tableColumns = [
  // {
  //   name: 'id',
  //   title: '',
  //   dataClass: 'center aligned',
  //   callback: 'showDetailRow'
  // },
  {
    name: 'name',
    title: 'Full Name',
    sortField: 'name'
  },
  {
    name: 'email',
    sortField: 'email',
    visible: true
  },
  {
    name: 'nickname',
    sortField: 'nickname'
  },
  {
    name: 'birthdate',
    sortField: 'birthdate',
  },
  {
    name: 'gender',
    sortField: 'gender',
    titleClass: 'center aligned',
    dataClass: 'center aligned'
  },
  {
    name: '__component:custom-actions',
    dataClass: 'center aligned'
  }
]
export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationDropdown,
    VuetablePaginationInfo
  },
  data () {
    return {
      msg: 'Hello Vue 2.0 + vuetable-2!',
      loading: '',
      searchFor: '',
      moreParams: {},
      fields: tableColumns,
      sortOrder: [{
        field: 'name',
        direction: 'asc'
      }],
      multiSort: true,
      paginationComponent: 'vuetable-pagination',
      perPage: 10,
      paginationInfoTemplate: 'Showing record: {from} to {to} from {total} item(s)'
    }
  },
  watch: {
    'perPage' (val, oldVal) {
      this.$nextTick(function () {
        this.$refs.vuetable.refresh()
      })
    },
    'paginationComponent' (val, oldVal) {
      this.$nextTick(function () {
        this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
      })
    }
  },
  methods: {
    transform: function (data) {
      let transformed = []
      for (let i = 0; i < data.length; i++) {
        transformed.push({
          id: data[i].id,
          name: data[i].name,
          nickname: data[i].nickname,
          email: data[i].email,
          birthdate: data[i].birthdate,
          gender: data[i].gender,
          address: data[i].address.line1 + ' ' + data[i].address.line2 + ' ' + data[i].address.zipcode
        })
      }

      return transformed
    },
    showSettingsModal () {
      // $('#settingsModal').modal({
      //   detachable: false,
      //   onVisible: function () {
      //     // $('.ui.checkbox').checkbox()
      //   }
      // }).modal('show')
    },
    showLoader: function () {
      this.loading = 'loading'
    },
    hideLoader: function () {
      this.loading = ''
    },
    getFieldTitle: function (field) {
      if (field.title !== '') return field.title

      if (field.name.slice(0, 2) === '__') {
        return field.name.indexOf(':') >= 0
          ? field.name.split(':')[1]
          : field.name.replace('__', '')
      }
    },
    allCap (value) {
      return value.toUpperCase()
    },
    formatDate (value, fmt) {
      if (value === null) return ''
      fmt = (typeof fmt === 'undefined') ? 'D MMM YYYY' : fmt
      // return moment(value, 'YYYY-MM-DD').format(fmt)
      return '1111-11-11'
    },
    gender (value) {
      return value === 'M'
        ? '<span class="ui teal label"><i class="male icon"></i>Male</span>'
        : '<span class="ui pink label"><i class="female icon"></i>Female</span>'
    },
    showDetailRow: function (value) {
      let icon = this.$refs.vuetable.isVisibleDetailRow(value) ? 'down' : 'right'
      debugger
      console.log([
        '<a class="show-detail-row">',
        '<i class="chevron circle ' + icon + ' icon"></i>',
        '</a>'
      ].join(''))
      return [
        '<a class="show-detail-row">',
        '<i class="chevron circle ' + icon + ' icon"></i>',
        '</a>'
      ].join('')
    },
    setFilter: function () {
      this.moreParams = {
        'filter': this.searchFor
      }
      this.$nextTick(function () {
        this.$refs.vuetable.refresh()
      })
    },
    resetFilter: function () {
      this.searchFor = ''
      this.setFilter()
    },
    preg_quote: function (str) {
      // http://kevin.vanzonneveld.net
      // +   original by: booeyOH
      // +   improved by: Ates Goral (http://magnetiq.com)
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   bugfixed by: Onno Marsman
      // *     example 1: preg_quote("$40");
      // *     returns 1: '\$40'
      // *     example 2: preg_quote("*RRRING* Hello?");
      // *     returns 2: '\*RRRING\* Hello\?'
      // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
      // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

      // return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1")
    },
    highlight: function (needle, haystack) {
      return haystack.replace(
        new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
        '<span class="highlight">$1</span>'
      )
    },
    rowClassCB: function (data, index) {
      return (index % 2) === 0 ? 'odd' : 'even'
    },
    onCellClicked (data, field, event) {
      console.log('cellClicked', field.name)
      if (field.name !== '__actions') {
        this.$refs.vuetable.toggleDetailRow(data.id)
      }
    },
    onCellDoubleClicked (data, field, event) {
      console.log('cellDoubleClicked:', field.name)
    },
    onActions (action, data) {
      console.log('actions: ', action, data.name)

      // if (action === 'view-item') {
      //   sweetAlert(action, data.name)
      // } else if (action === 'edit-item') {
      //   sweetAlert(action, data.name)
      // } else if (action === 'delete-item') {
      //   sweetAlert(action, data.name)
      // }
    },
    onLoadSuccess (response) {
      // set pagination data to pagination-info component
      this.$refs.paginationInfo.setPaginationData(response.data)

      let data = response.data.data
      if (this.searchFor !== '') {
        for (let n in data) {
          data[n].name = this.highlight(this.searchFor, data[n].name)
          data[n].email = this.highlight(this.searchFor, data[n].email)
        }
      }
    },
    onLoadError (response) {
      // if (response.status == 400) {
      //   sweetAlert('Something\'s Wrong!', response.data.message, 'error')
      // } else {
      //   sweetAlert('Oops', E_SERVER_ERROR, 'error')
      // }
    },
    onPaginationData (tablePagination) {
      this.$refs.paginationInfo.setPaginationData(tablePagination)
      this.$refs.pagination.setPaginationData(tablePagination)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    registerEvents () {
      let self = this
      this.$on('vuetable:action', (action, data) => {
        self.onActions(action, data)
      })
      this.$on('vuetable:cell-clicked', (data, field, event) => {
        self.onCellClicked(data, field, event)
      })
      this.$on('vuetable:cell-dblclicked', (data, field, event) => {
        self.onCellDoubleClicked(data, field, event)
      })
      this.$on('vuetable:load-success', (response) => {
        self.onLoadSuccess(response)
      })
      this.$on('vuetable:load-error', (response) => {
        self.onLoadError(response)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
  .page-header {
    text-align: center;
  }
</style>
