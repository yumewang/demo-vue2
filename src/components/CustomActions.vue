<template>
  <div>
    <button class="btn btn-default" @click="itemAction('view-item', rowData)"><i class="glyphicon glyphicon-zoom-in"></i>查看</button>
    <button class="btn btn-default" @click="itemAction('edit-item', rowData)"><i class="glyphicon glyphicon-pencil"></i>编辑</button>
    <button class="btn btn-default" @click="itemAction('delete-item', rowData)"><i class="glyphicon glyphicon-remove"></i>删除</button>
  </div>
</template>
<script>
  export default {
    props: {
      rowData: {
        type: Object,
        required: true
      }
    },
    methods: {
      onClick: function (event) {
        console.log('actions: on-click', event.target)
      },
      onDoubleClick: function (event) {
        console.log('actions: on-dblclick', event.target)
      }
    }
  }
</script>
