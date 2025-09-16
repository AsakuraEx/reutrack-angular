export const options = [
    {
        path: '/',
        name: 'Inicio',
        icon: 'home',
        permiso: [1,2]
    },
    {
        path: '/historial',
        name: 'Historial de reuniones',
        icon: 'book',
        permiso: [1,2]
    },
    {
        id: 'reportes',
        desplegable: true,
        name: 'Reportes',
        icon: 'article',
        permiso: [1,2],
        opciones: [
            {
                path: '/reportes/reactivados',
                name: 'Reuniones reactivadas',
                permiso: [1,2]
            },
            {
                path: '/reportes/eliminados',
                name: 'Proyectos eliminados',
                permiso: [1]    
            },

        ]
    },
    {
        id: 'opciones',
        desplegable: true,
        name: 'Configuraciones',
        icon: 'settings',
        permiso: [1,2],
        opciones: [
            {
                path: '/proyectos',
                name: 'Gestión de proyectos',
                permiso: [1,2]
            },
            {
                path: '/usuarios',
                name: 'Gestión de usuarios', 
                permiso: [1]   
            },

        ]
    }
]