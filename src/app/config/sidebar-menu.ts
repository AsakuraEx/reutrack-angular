export const options = [
    {
        path: '/',
        name: 'Inicio',
        icon: 'home',
        permiso: [1,2]
    },
    {
        path: '/programacion-reuniones',
        name: 'Programación de reuniones',
        icon: 'calendar_today',
        permiso: [1, 2]
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
                id: 'requerimientos',
                desplegable: true,
                name: 'Requerimientos',
                permiso: [1,2],
                opciones: [
                    {
                        path: '/reportes/requerimientos/estado-requerimientos',
                        name: 'Estado de requerimientos',
                        permiso: [1, 2]
                    },
                    {
                        path: '/reportes/requerimientos/tiempos-requerimientos',
                        name: 'Tiempo promedio de requerimientos',
                        permiso: [1, 2]
                    },

                ]
            },
            {
                id: 'reuniones',
                desplegable: true,
                name: 'Reuniones',
                permiso: [1,2],
                opciones: [
                    {
                        path: '/reportes/reuniones/reuniones-realizadas',
                        name: 'Reuniones realizadas',
                        permiso: [1, 2]
                    },
                    {
                        path: '/reportes/reuniones/reuniones-motivo',
                        name: 'Reuniones por motivo',
                        permiso: [1, 2]
                    },

                ]
            },
            {
                id: 'actas_aceptacion',
                desplegable: true,
                name: 'Actas de aceptación',
                permiso: [1,2],
                opciones: [
                    {
                        path: 'reportes/actas-de-aceptacion',
                        name: 'Estado de actas de aceptación',
                        permiso: [1,2]
                    },
                    {
                        path: '/',
                        name: 'Aceptación de funcionalidades',
                        permiso: [1, 2]
                    },

                ]
            },
            {
                id: 'bitacora',
                desplegable: true,
                name: 'Bitacoras',
                permiso: [1,2],
                opciones: [
                    {
                        path: 'reportes/reuniones-reactivadas',
                        name: 'Reuniones reactivadas',
                        permiso: [1,2]
                    },
                    {
                        path: 'reportes/proyectos-eliminados',
                        name: 'Proyectos eliminados',
                        permiso: [1]    
                    },

                ]
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