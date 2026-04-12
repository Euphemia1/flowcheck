# Installing Node.js for FlowCheck

## Option 1: Download Node.js Official Installer (Recommended)

1. **Go to https://nodejs.org/**
2. **Download the LTS version** (Long Term Support - most stable)
3. **Run the installer** (.msi file)
4. **Restart your terminal/command prompt** after installation
5. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

## Option 2: Using Chocolatey (if you have it)

If you have Chocolatey package manager:
```bash
choco install nodejs-lts
```

## Option 3: Using Windows Package Manager

If you have Windows Package Manager:
```bash
winget install OpenJS.NodeJS
```

## After Installation

Once Node.js is installed, navigate back to the project and run:

```bash
cd c:\Users\XPS\Downloads\flowcheck-master\flowcheck-master
npm install
```

## Then Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Troubleshooting

- If `node` command still not found after installation, **restart your computer**
- Make sure you added Node.js to PATH during installation
- Check if Node.js was installed to `C:\Program Files\nodejs\`
