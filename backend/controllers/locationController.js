const { pool } = require('../config/database');

exports.getAllLocations = async (req, res) => {
    try {
        const { type, status, search } = req.query;

        let query = 'SELECT * FROM locations WHERE 1=1';
        const params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (name LIKE ? OR address LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY name ASC';

        console.log('Executing query:', query);
        console.log('Parameters:', params);

        const [rows] = await pool.execute(query, params);

        console.log(`Found ${rows.length} locations from MySQL`);

        res.json({
            success: true,
            message: `Found ${rows.length} locations`,
            locations: rows
        });

    } catch (error) {
        console.error('Error fetching locations from MySQL:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch locations from database',
            details: error.message
        });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            'SELECT * FROM locations WHERE id_location = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location not found'
            });
        }

        res.json({
            success: true,
            location: rows[0]
        });

    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch location'
        });
    }
};

exports.createLocation = async (req, res) => {
    try {
        const {
            name,
            type,
            address,
            coordinates,
            description,
            capacity,
            operating_hours
        } = req.body;

        // Basic validation
        if (!name || !type || !address) {
            return res.status(400).json({
                success: false,
                error: 'Name, type, and address are required'
            });
        }

        if (!['terminal', 'koridor', 'stand'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid location type'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO locations (name, type, address, coordinates, description, capacity, status, operating_hours) 
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
            [name, type, address, coordinates, description, capacity, operating_hours]
        );

        const [newLocation] = await pool.execute(
            'SELECT * FROM locations WHERE id_location = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Location created successfully',
            location: newLocation[0]
        });

    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create location'
        });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            type,
            address,
            coordinates,
            description,
            capacity,
            status,
            operating_hours
        } = req.body;

        const [existing] = await pool.execute(
            'SELECT * FROM locations WHERE id_location = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location not found'
            });
        }

        const updates = [];
        const params = [];

        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        if (type !== undefined) {
            const normalizedType = String(type).toLowerCase().trim();
            console.log(`[UpdateLocation] Received type: '${type}', normalized: '${normalizedType}'`);

            if (!['terminal', 'koridor', 'stand'].includes(normalizedType)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid location type. Received: '${type}'`,
                    validTypes: ['terminal', 'koridor', 'stand']
                });
            }
            updates.push('type = ?');
            params.push(normalizedType);
        }
        if (address !== undefined) {
            updates.push('address = ?');
            params.push(address);
        }
        if (coordinates !== undefined) {
            updates.push('coordinates = ?');
            params.push(coordinates);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (capacity !== undefined) {
            updates.push('capacity = ?');
            params.push(capacity);
        }
        if (status !== undefined) {
            if (!['active', 'inactive', 'maintenance'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status'
                });
            }
            updates.push('status = ?');
            params.push(status);
        }
        if (operating_hours !== undefined) {
            updates.push('operating_hours = ?');
            params.push(operating_hours);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        await pool.execute(
            `UPDATE locations SET ${updates.join(', ')} WHERE id_location = ?`,
            params
        );

        const [updated] = await pool.execute(
            'SELECT * FROM locations WHERE id_location = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Location updated successfully',
            location: updated[0]
        });

    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update location'
        });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute(
            'SELECT * FROM locations WHERE id_location = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location not found'
            });
        }

        await pool.execute('DELETE FROM locations WHERE id_location = ?', [id]);

        res.json({
            success: true,
            message: 'Location deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete location'
        });
    }
};
