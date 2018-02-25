module.exports = [
    {
        label: 'File',
        submenu: [
            { label: 'Close' },
            { label: 'Quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'copy'
            },
            {
                role: 'paste'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Online Documentation',
                click: () => { console.log('hello from electron') }
            }
        ]
    }
]