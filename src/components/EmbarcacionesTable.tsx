import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form, Modal } from 'antd';

interface Embarcacion {
    id: number;
    nombre: string;
    capacidad: number;
    descripcion: string;
    fechaProgramada: string;
}

const EmbarcacionesTable: React.FC = () => {
    const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
    const [newEmbarcacion, setNewEmbarcacion] = useState<Partial<Embarcacion>>({});
    const [editingEmbarcacion, setEditingEmbarcacion] = useState<Partial<Embarcacion> | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        fetchEmbarcaciones();
    }, []);

    const fetchEmbarcaciones = () => {
        axios.get('/api/embarcaciones')
            .then(response => {
                setEmbarcaciones(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleAdd = () => {
        form.validateFields().then(values => {
            axios.post('/api/embarcaciones', values)
                .then(response => {
                    setEmbarcaciones([...embarcaciones, response.data]);
                    setNewEmbarcacion({});
                    form.resetFields();
                })
                .catch(error => {
                    console.error('Error adding data:', error);
                });
        }).catch(errorInfo => {
            console.error('Validation Failed:', errorInfo);
        });
    };

    const handleEdit = (id: number) => {
        const embarcacion = embarcaciones.find(e => e.id === id);
        if (embarcacion) {
            setEditingEmbarcacion(embarcacion);
            setIsModalVisible(true);
            editForm.setFieldsValue(embarcacion);
        }
    };

    const handleUpdate = () => {
        editForm.validateFields().then(values => {
            if (editingEmbarcacion && editingEmbarcacion.id) {
                axios.put(`/api/embarcaciones/${editingEmbarcacion.id}`, values)
                    .then(response => {
                        setEmbarcaciones(embarcaciones.map(e => e.id === editingEmbarcacion.id ? response.data : e));
                        setEditingEmbarcacion(null);
                        setIsModalVisible(false);
                    })
                    .catch(error => {
                        console.error('Error updating data:', error);
                    });
            }
        }).catch(errorInfo => {
            console.error('Validation Failed:', errorInfo);
        });
    };

    const handleDelete = (id: number) => {
        axios.delete(`/api/embarcaciones/${id}`)
            .then(() => {
                setEmbarcaciones(embarcaciones.filter(e => e.id !== id));
            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Capacidad (T)', dataIndex: 'capacidad', key: 'capacidad', render: (text: number) => `${text} T` },
        { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
        { title: 'Fecha Programada', dataIndex: 'fechaProgramada', key: 'fechaProgramada' },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text: any, record: Embarcacion) => (
                <>
                    <Button onClick={() => handleEdit(record.id)}>Editar</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Eliminar</Button>
                </>
            ),
        },
    ];

    return (
        <div className="embarcaciones-container">
            <h1>Embarcaciones</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <Form form={form} layout="vertical" onFinish={handleAdd}>
                        <Form.Item
                            label="Nombre"
                            name="nombre"
                            rules={[{ required: true, message: 'El nombre no puede ser nulo' }, { max: 50, message: 'El nombre no puede tener más de 50 caracteres' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Capacidad"
                            name="capacidad"
                            rules={[{ required: true, message: 'La capacidad no puede ser nula' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Descripción"
                            name="descripcion"
                            rules={[{ required: true, message: 'La descripción no puede ser nula'}, { max: 250, message: 'La descripción no puede tener más de 250 caracteres' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Fecha Programada"
                            name="fechaProgramada"
                            rules={[{ required: true, message: 'La fecha no puede ser nula' }]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Añadir</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <img src="https://i.gifer.com/SU1.gif" style={{ maxWidth: '100px' }} />
                </div>
            </div>
            <Table dataSource={embarcaciones} columns={columns} rowKey="id" />
            <Modal
                title="Editar Embarcación"
                visible={isModalVisible}
                onOk={handleUpdate}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="Nombre"
                        name="nombre"
                        rules={[{ required: true, message: 'El nombre no puede ser nulo' }, { max: 50, message: 'El nombre no puede tener más de 50 caracteres' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Capacidad"
                        name="capacidad"
                        rules={[{ required: true, message: 'La capacidad no puede ser nula' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Descripción"
                        name="descripcion"
                        rules={[{ required: true, message: 'La descripción no puede ser nula'}, { max: 250, message: 'La descripción no puede tener más de 250 caracteres' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Fecha Programada"
                        name="fechaProgramada"
                        rules={[{ required: true, message: 'La fecha no puede ser nula' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmbarcacionesTable;