export const options = [
    {
        path: '/',
        name: 'Inicio',
        icon: 'home'
    },
    {
        path: '/historial',
        name: 'Historial de reuniones',
        icon: 'book'
    },
    {
        id: 'reportes',
        desplegable: true,
        name: 'Reportes',
        icon: 'article',
        opciones: [
            {
                path: '/proyectos',
                name: 'Proyectos reactivados',
            },
            {
                path: '/usuarios',
                name: 'Proyectos eliminados',    
            },

        ]
    },
    {
        id: 'opciones',
        desplegable: true,
        name: 'Configuraciones',
        icon: 'settings',
        opciones: [
            {
                path: '/proyectos',
                name: 'Gestión de proyectos',
            },
            {
                path: '/usuarios',
                name: 'Gestión de usuarios',    
            },

        ]
    }
]