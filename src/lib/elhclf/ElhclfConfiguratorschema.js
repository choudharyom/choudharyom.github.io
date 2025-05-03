// src/lib/elhclf/ElhclfConfiguratorschema.js

/**
 * ELHLCF Configuration Schema Definition
 *
 * This schema defines the structure for the generalized configuration object
 * used by the ELHLCF tool. It aims to capture common configuration parameters
 * across various embedded Linux build systems (Buildroot, Yocto, Ptxdist, etc.).
 *
 * Version: 1.0.0
 */
const elhclfSchema = {
  // --- Metadata ---
  metadata: {
    schemaVersion: '1.0.0', // Version of this schema structure
    projectName: '',        // Optional: User-defined project name
    description: '',        // Optional: Brief description of the target system
    createdAt: '',          // Optional: Timestamp when generated (can be added by generateConfig)
    toolVersion: '',        // Optional: Version of the ELHLCF tool used (can be added by generateConfig)
  },

  // --- Target Hardware ---
  target: {
    architecture: '', // Mandatory: e.g., "armv7", "aarch64", "x86_64", "riscv64", "mips"
    cpu: '',          // Optional: Specific CPU model (e.g., "cortex-a7", "imx6ull", "raspberrypi4")
    board: '',        // Optional: Specific board name (e.g., "beagleboneblack", "qemu-arm-virt")
    features: [],     // Optional: List of required CPU/SoC features (e.g., ["neon", "crypto"])
  },

  // --- Build Toolchain ---
  toolchain: {
    type: 'internal', // 'internal' (build system builds it) or 'external' (pre-built)
    // --- Options for 'internal' toolchain ---
    gccVersion: '',   // e.g., "11.2.0"
    libc: 'glibc',    // 'glibc', 'musl', 'uclibc-ng'
    binutilsVersion: '', // Optional: Specific binutils version
    kernelHeadersVersion: '', // Optional: Match kernel or specify (e.g., "5.15.x")
    // --- Options for 'external' toolchain ---
    externalPath: '', // Mandatory if type is 'external': Path or URL to the toolchain tarball/directory
    externalPrefix: '', // Optional: Toolchain prefix (e.g., "arm-linux-gnueabihf-") - often derivable
    // --- Common Options ---
    cppSupport: true, // Include C++ support?
    fortranSupport: false, // Include Fortran support?
    optimizationLevel: 'O2', // e.g., "Os", "O2", "O3"
    abi: '',          // Optional: Specific ABI (e.g., "eabihf" for ARM hard-float)
  },

  // --- Linux Kernel ---
  kernel: {
    sourceType: 'version', // 'version' (LTS/stable), 'git', 'local', 'none'
    // --- Options for 'version' ---
    version: '',      // Mandatory if sourceType is 'version': e.g., "6.1.x", "5.15.y"
    // --- Options for 'git' ---
    gitRepo: '',      // Mandatory if sourceType is 'git': URL of the git repository
    gitBranch: 'main',// Mandatory if sourceType is 'git': Branch, tag, or commit hash
    // --- Options for 'local' ---
    localPath: '',    // Mandatory if sourceType is 'local': Path to local kernel source tree
    // --- Configuration ---
    configType: 'defconfig', // 'defconfig', 'custom', 'fragments'
    defconfigName: '', // Mandatory if configType is 'defconfig': e.g., "multi_v7_defconfig", "imx_v6_v7_defconfig"
    customConfigPath: '', // Mandatory if configType is 'custom': Path to the full .config file
    configFragments: [], // Mandatory if configType is 'fragments': Array of paths to config fragments to merge
    // --- Patches ---
    patches: [],      // Array of paths or URLs to patch files to apply
    // --- Build Options ---
    buildArgs: '',    // Optional: Extra arguments for the kernel build (e.g., "LOADADDR=0x80008000")
    buildTarget: 'zImage', // 'zImage', 'bzImage', 'uImage', etc.
    deviceTreeBlobs: [], // List of DTB files to build (e.g., ["imx6ull-myboard.dtb"])
  },

  // --- Bootloader ---
  bootloader: {
    type: 'uboot',    // 'uboot', 'grub', 'barebox', 'systemd-boot', 'none'
    sourceType: 'version', // 'version', 'git', 'local'
    // --- Options for 'version' ---
    version: '',      // Mandatory if sourceType is 'version': e.g., "2023.07"
    // --- Options for 'git' ---
    gitRepo: '',      // Mandatory if sourceType is 'git': URL of the git repository
    gitBranch: 'main',// Mandatory if sourceType is 'git': Branch, tag, or commit hash
    // --- Options for 'local' ---
    localPath: '',    // Mandatory if sourceType is 'local': Path to local bootloader source tree
    // --- Configuration ---
    configType: 'defconfig', // 'defconfig', 'custom'
    defconfigName: '', // Mandatory if configType is 'defconfig': e.g., "am335x_evm_defconfig", "rpi_4_defconfig"
    customConfigPath: '', // Mandatory if configType is 'custom': Path to the custom config file (e.g., board header)
    // --- Patches ---
    patches: [],      // Array of paths or URLs to patch files to apply
    // --- Environment/Settings ---
    environment: {},  // Key-value pairs for default bootloader environment variables (e.g., { bootdelay: '1', bootcmd: 'run netboot' })
    installDevice: '', // Optional: Device where the bootloader should be installed (e.g., "/dev/mmcblk0") - Highly build-system specific
  },

  // --- Root Filesystem ---
  filesystem: {
    type: 'ext4',     // 'ext4', 'squashfs', 'jffs2', 'ubifs', 'initramfs', 'tar'
    size: '',         // Optional: Desired minimum size (e.g., "512M", "1G"). Some build systems auto-size.
    compression: '',  // Optional: Compression type for squashfs/jffs2 (e.g., "xz", "gzip", "lzo")
    makeClean: true,  // Run `make clean` in the build directory before building fs?
    extraSpace: '10%',// Optional: Add extra free space (e.g., "50M", "10%")
    rootPassword: '', // Optional: Set root password (plain text or crypt hash - build system dependent)
    rootPasswordMethod: 'crypt', // 'plain', 'crypt', 'none' (lock root)
    // --- OverlayFS Options (if applicable) ---
    overlay: {
      enabled: false,
      persistentDevice: '', // e.g., "/dev/mmcblk0p3"
      mountPoint: '/overlay',
    },
    // --- Specific FS Type Options ---
    ext4: {
      journal: true,
      label: 'rootfs',
      inodeSize: 256,
    },
    ubifs: {
      lebSize: '', // Logical Erase Block size (mandatory for UBI)
      minIoSize: '', // Minimum I/O unit size (mandatory for UBI)
      maxLebCount: '', // Max LEB count (mandatory for UBI)
    },
    // ... other fs specific options
  },

  // --- Userspace Packages & Configuration ---
  packages: [
    // Example entries:
    // { name: 'openssh-server' },
    // { name: 'python3', version: '3.10.x' },
    // { name: 'busybox', configOptions: 'CONFIG_FEATURE_FANCY_ECHO=y' }, // Build system specific config format
    // { name: 'custom-app', source: { type: 'git', repo: '...', branch: '...' }, patches: ['...'] }
  ], // Array of package objects: { name, version?, configOptions?, patches?, source? }

  // --- Network Configuration ---
  network: {
    hostname: 'embedded-linux', // Default system hostname
    interfaces: [
      // Example entry:
      // {
      //   name: 'eth0',
      //   type: 'dhcp', // 'dhcp', 'static', 'none'
      //   autoStart: true,
      //   // --- Options for 'static' ---
      //   ipAddress: '192.168.1.100',
      //   netmask: '255.255.255.0',
      //   gateway: '192.168.1.1',
      //   dnsServers: ['8.8.8.8', '1.1.1.1'],
      //   macAddress: '' // Optional: Set MAC address
      // }
    ],
    wifi: { // Optional: Specific settings for Wi-Fi
      ssid: '',
      password: '',
      driver: '', // e.g., 'nl80211'
    },
    firewall: { // Optional: Basic firewall rules (build system dependent)
      enabled: false,
      rules: [], // e.g., ["ALLOW INPUT tcp 22", "DENY OUTPUT udp 53"]
    },
  },

  // --- Userspace System Configuration ---
  userspace: {
    initSystem: 'systemd', // 'systemd', 'sysvinit', 'openrc', 'busybox-init'
    timezone: 'UTC',       // e.g., "UTC", "Europe/London", "America/New_York"
    locale: {
      generation: ['en_US.UTF-8 UTF-8'], // Locales to generate
      default: 'en_US.UTF-8',           // Default system locale
    },
    users: [
      // Example entry:
      // {
      //   name: 'admin',
      //   password: '$6$rounds=5000$...', // Use crypt hash format if possible
      //   passwordMethod: 'crypt', // 'plain', 'crypt', 'none' (no login)
      //   groups: ['sudo', 'adm', 'dialout'],
      //   shell: '/bin/bash',
      //   homeDirectory: '/home/admin',
      //   uid: 1000, // Optional: Specify UID
      //   createHome: true,
      // }
    ],
    groups: [
      // Example entry:
      // { name: 'gpio', gid: 997 } // Optional: Specify GID
    ], // Additional groups to create
    services: { // Optional: Enable/disable specific services (systemd/sysvinit names)
      enabled: ['sshd', 'network-manager'],
      disabled: ['avahi-daemon'],
    },
    getty: { // Configuration for serial/virtual terminals
      port: 'ttyS0', // Default serial console port
      baudRate: 115200,
      term: 'vt102', // Terminal type
    },
  },

  // --- Device Specific / Hardware Configuration ---
  deviceSpecific: {
    // This section is for less common, often hardware-specific settings
    // that don't fit neatly elsewhere.
    deviceTree: { // More specific DT settings if needed beyond kernel build
      overlays: [], // List of DT overlays to apply at boot
      customDtbPath: '', // Path to a pre-built DTB to use instead of kernel-built one
    },
    firmware: [], // List of required firmware blobs/files (paths or names)
    bootScript: { // Custom script to run after bootloader, before init
      sourcePath: '', // Path to the script source
      installPath: '/etc/init.d/S01customboot', // Where to install it (example)
    },
    hardwareQuirks: {}, // Key-value pairs for specific hardware workarounds
    modules: { // Kernel modules configuration
      load: [], // Modules to load automatically at boot
      blacklist: [], // Modules to prevent from loading
      options: {}, // Key-value options for modules (e.g., { "i8042": "nomux=1" })
    },
  },

  // --- Build System Specific Options ---
  // Optional: Allows passing raw config options directly to a specific build system
  // Use this sparingly, as it reduces the generality of the configuration.
  buildSystemOverrides: {
    buildroot: {
      configFragments: [], // Paths to Buildroot specific .config fragments
      env: {}, // Environment variables for the Buildroot build
    },
    yocto: {
      layers: [], // List of meta-layers to include
      localConf: '', // String containing lines to add to local.conf
      bblayersConf: '', // String containing lines to add to bblayers.conf
    },
    ptxdist: {
      // ... ptxdist specific overrides
    },
    // ... other build systems
  }
};

// Export the schema object as the default export for this module
export default elhclfSchema;
