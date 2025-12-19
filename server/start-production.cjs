#!/usr/bin/env node

/**
 * Production Startup Script
 * Starts both Express backend and Next.js admin server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting HumbleFlow production servers...\n');

// Start Next.js admin server on port 3001
console.log('📦 Starting Admin Dashboard (Next.js) on port 3001...');
const adminServer = spawn('npm', ['run', 'start'], {
    cwd: path.join(__dirname, '../admin'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '3001' }
});

// Wait a bit for Next.js to start, then start Express
setTimeout(() => {
    console.log('🔧 Starting Express Backend on port 3000...');
    const expressServer = spawn('node', ['dist/server/index.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, NODE_ENV: 'production' }
    });

    expressServer.on('error', (err) => {
        console.error('❌ Express server error:', err);
        process.exit(1);
    });

    expressServer.on('exit', (code) => {
        console.log(`Express server exited with code ${code}`);
        adminServer.kill();
        process.exit(code);
    });
}, 3000);

adminServer.on('error', (err) => {
    console.error('❌ Admin server error:', err);
    process.exit(1);
});

adminServer.on('exit', (code) => {
    console.log(`Admin server exited with code ${code}`);
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    adminServer.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    adminServer.kill();
    process.exit(0);
});
