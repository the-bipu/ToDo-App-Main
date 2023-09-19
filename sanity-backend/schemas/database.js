export default{
    name:'database',
    title:'Data',
    type: 'document',
    fields:[
        {
            name:'title',
            title:'Title',
            type:'string'
        },
        {
            name: 'isChecked',
            title: 'IsChecked',
            type: 'boolean',
            default: false
        }
    ]
}