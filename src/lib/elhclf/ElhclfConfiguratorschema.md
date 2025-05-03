# ELHLCF Configuration Schema Documentation

**Version:** 1.0.0 (Matches `metadata.schemaVersion` in the schema)

This document describes the structure and fields of the generalized configuration object used by the Embedded Linux High-Level Configuration Framework (ELHLCF). This schema aims to capture common configuration parameters across various embedded Linux build systems like Buildroot, Yocto, Ptxdist, etc., providing a unified way to define a target system.

The configuration is typically represented as a JSON object.

---

## Table of Contents

*   Metadata
*   Target Hardware
*   Build Toolchain
*   Linux Kernel
*   Bootloader
*   Root Filesystem
*   Userspace Packages & Configuration
*   Network Configuration
*   Userspace System Configuration
*   Device Specific / Hardware Configuration
*   Build System Specific Options

---

## `metadata`

Contains general information about the configuration file itself.

*   `schemaVersion` (string, **Mandatory**): Version of the schema structure this file adheres to.
    *   *Example:* `"1.0.0"`
*   `projectName` (string, *Optional*): User-defined name for the project or configuration.
    *   *Example:* `"My IoT Device"`
*   `description` (string, *Optional*): A brief description of the target system or project.
    *   *Example:* `"Configuration for a custom weather station based on Raspberry Pi CM4."`
*   `createdAt` (string, *Optional*): ISO 8601 timestamp indicating when the configuration file was generated. Typically added by the generation tool.
    *   *Example:* `"2023-10-27T10:30:00Z"`
*   `toolVersion` (string, *Optional*): Version of the ELHLCF tool used to generate the configuration. Typically added by the generation tool.
    *   *Example:* `"0.2.1"`

---

## `target`

Defines the target hardware platform.

*   `architecture` (string, **Mandatory**): The primary CPU architecture.
    *   *Examples:* `"armv7"`, `"aarch64"`, `"x86_64"`, `"riscv64"`, `"mips"`
*   `cpu` (string, *Optional*): Specific CPU model or family within the architecture.
    *   *Examples:* `"cortex-a7"`, `"imx6ull"`, `"raspberrypi4"`, `"intel-corei7"`
*   `board` (string, *Optional*): Specific board name or identifier, often used by build systems to select default configurations.
    *   *Examples:* `"beagleboneblack"`, `"qemu-arm-virt"`, `"raspberrypi4-64"`
*   `features` (array of strings, *Optional*): List of required CPU/SoC features (e.g., instruction set extensions). Build system support varies.
    *   *Examples:* `["neon", "crypto"]`, `["sse4.2", "avx"]`

---

## `toolchain`

Specifies the cross-compilation toolchain to be used.

*   `type` (string, **Mandatory**): Specifies whether to use a toolchain built by the build system or an external one.
    *   *Values:* `"internal"`, `"external"`
    *   *Default:* `"internal"`
*   **Options for `type: 'internal'`:**
    *   `gccVersion` (string, *Optional*): Desired GCC version. Build system may have constraints.
        *   *Example:* `"11.2.0"`
    *   `libc` (string, **Mandatory** if `type` is `internal`): C library to use.
        *   *Values:* `"glibc"`, `"musl"`, `"uclibc-ng"`
        *   *Default:* `"glibc"`
    *   `binutilsVersion` (string, *Optional*): Specific binutils version.
    *   `kernelHeadersVersion` (string, *Optional*): Specify kernel headers version, otherwise often matched to the selected kernel version.
        *   *Example:* `"5.15.x"`
*   **Options for `type: 'external'`:**
    *   `externalPath` (string, **Mandatory** if `type` is `external`): Filesystem path or URL to the pre-built external toolchain (e.g., tarball or directory).
        *   *Example:* `"/opt/toolchains/gcc-arm-11.2-2022.02-x86_64-arm-none-linux-gnueabihf"` or `"http://example.com/toolchain.tar.gz"`
    *   `externalPrefix` (string, *Optional*): Toolchain tuple prefix. Often derivable by the build system but can be specified explicitly.
        *   *Example:* `"arm-linux-gnueabihf-"`
*   **Common Options:**
    *   `cppSupport` (boolean, *Optional*): Include C++ support in the toolchain and target filesystem.
        *   *Default:* `true`
    *   `fortranSupport` (boolean, *Optional*): Include Fortran support.
        *   *Default:* `false`
    *   `optimizationLevel` (string, *Optional*): Default optimization level for compiled code.
        *   *Values:* `"Os"`, `"O0"`, `"O1"`, `"O2"`, `"O3"`
        *   *Default:* `"O2"`
    *   `abi` (string, *Optional*): Specify the Application Binary Interface (ABI), particularly relevant for ARM.
        *   *Examples:* `"eabi"`, `"eabihf"` (hard-float)

---

## `kernel`

Configuration for the Linux kernel.

*   `sourceType` (string, **Mandatory**): Method for obtaining the kernel source.
    *   *Values:* `"version"`, `"git"`, `"local"`, `"none"` (no kernel build)
    *   *Default:* `"version"`
*   **Options for `sourceType: 'version'`:**
    *   `version` (string, **Mandatory** if `sourceType` is `version`): Kernel version string (e.g., specific version, LTS branch). Build system determines how this is resolved.
        *   *Examples:* `"6.1.55"`, `"5.15.x"`
*   **Options for `sourceType: 'git'`:**
    *   `gitRepo` (string, **Mandatory** if `sourceType` is `git`): URL of the kernel Git repository.
        *   *Example:* `"https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git"`
    *   `gitBranch` (string, **Mandatory** if `sourceType` is `git`): Branch, tag, or commit hash to check out.
        *   *Default:* `"main"`
        *   *Examples:* `"linux-6.1.y"`, `"v6.5"`, `"abcdef123456"`
*   **Options for `sourceType: 'local'`:**
    *   `localPath` (string, **Mandatory** if `sourceType` is `local`): Filesystem path to the local kernel source tree.
        *   *Example:* `"/home/user/linux-custom"`
*   **Kernel Configuration:**
    *   `configType` (string, **Mandatory** if building kernel): Method for configuring the kernel.
        *   *Values:* `"defconfig"`, `"custom"`, `"fragments"`
        *   *Default:* `"defconfig"`
    *   `defconfigName` (string, **Mandatory** if `configType` is `defconfig`): Name of the defconfig file within the kernel source tree (usually in `arch/<arch>/configs/`).
        *   *Examples:* `"multi_v7_defconfig"`, `"imx_v6_v7_defconfig"`, `"x86_64_defconfig"`
    *   `customConfigPath` (string, **Mandatory** if `configType` is `custom`): Path to a complete, custom `.config` file to use.
        *   *Example:* `"/path/to/my/custom.config"`
    *   `configFragments` (array of strings, **Mandatory** if `configType` is `fragments`): List of paths to kernel configuration fragments (`.config` snippets) to be merged. Order might matter.
        *   *Example:* `["/path/to/base.frag", "/path/to/drivers.frag", "board-specific.frag"]`
*   **Patches:**
    *   `patches` (array of strings, *Optional*): List of paths or URLs to patch files to apply to the kernel source before building. Applied in order.
        *   *Example:* `["patches/kernel/0001-fix-driver.patch", "http://example.com/feature.patch"]`
*   **Build Options:**
    *   `buildArgs` (string, *Optional*): Extra arguments passed to the kernel `make` command.
        *   *Example:* `"LOADADDR=0x80008000"`
    *   `buildTarget` (string, *Optional*): The specific kernel image target to build.
        *   *Default:* `"zImage"` (often depends on architecture)
        *   *Examples:* `"zImage"`, `"bzImage"`, `"uImage"`, `"Image.gz"`
    *   `deviceTreeBlobs` (array of strings, *Optional*): List of Device Tree Blob (DTB) filenames (relative to `arch/<arch>/boot/dts/`) to build.
        *   *Example:* `["imx6ull-myboard.dtb", "overlays/feature-overlay.dtbo"]`

---

## `bootloader`

Configuration for the bootloader (e.g., U-Boot, GRUB).

*   `type` (string, **Mandatory**): The type of bootloader to build and install.
    *   *Values:* `"uboot"`, `"grub"`, `"barebox"`, `"systemd-boot"`, `"none"`
    *   *Default:* `"uboot"`
*   `sourceType` (string, **Mandatory** if `type` is not `none`): Method for obtaining the bootloader source.
    *   *Values:* `"version"`, `"git"`, `"local"`
    *   *Default:* `"version"`
*   **Options for `sourceType: 'version'`:**
    *   `version` (string, **Mandatory** if `sourceType` is `version`): Bootloader version string.
        *   *Example:* `"2023.07"`, `"2.06"`
*   **Options for `sourceType: 'git'`:**
    *   `gitRepo` (string, **Mandatory** if `sourceType` is `git`): URL of the bootloader Git repository.
    *   `gitBranch` (string, **Mandatory** if `sourceType` is `git`): Branch, tag, or commit hash.
        *   *Default:* `"main"` (or `"master"` for older projects)
*   **Options for `sourceType: 'local'`:**
    *   `localPath` (string, **Mandatory** if `sourceType` is `local`): Path to the local bootloader source tree.
*   **Bootloader Configuration:**
    *   `configType` (string, **Mandatory** if building bootloader): Method for configuring the bootloader.
        *   *Values:* `"defconfig"`, `"custom"`
        *   *Default:* `"defconfig"`
    *   `defconfigName` (string, **Mandatory** if `configType` is `defconfig`): Name of the defconfig file/target for the bootloader.
        *   *Examples:* `"am335x_evm_defconfig"`, `"rpi_4_defconfig"`
    *   `customConfigPath` (string, **Mandatory** if `configType` is `custom`): Path to a custom configuration file (e.g., board header for U-Boot).
        *   *Example:* `"include/configs/myboard.h"`
*   **Patches:**
    *   `patches` (array of strings, *Optional*): List of paths or URLs to patch files to apply to the bootloader source.
*   **Environment/Settings:**
    *   `environment` (object, *Optional*): Key-value pairs defining default bootloader environment variables. Format might be build-system specific.
        *   *Example:* `{ "bootdelay": "1", "bootcmd": "run netboot", "serverip": "192.168.1.1" }`
    *   `installDevice` (string, *Optional*): Hint for the build system about where the bootloader should be installed. Highly dependent on the build system and target storage.
        *   *Example:* `"/dev/mmcblk0"`

---

## `filesystem`

Defines the root filesystem image.

*   `type` (string, **Mandatory**): The type of filesystem image to generate.
    *   *Values:* `"ext4"`, `"squashfs"`, `"jffs2"`, `"ubifs"`, `"initramfs"`, `"tar"`
    *   *Default:* `"ext4"`
*   `size` (string, *Optional*): Desired minimum size for the filesystem image. Some build systems auto-size based on content. Units like `M` (MiB) or `G` (GiB) are common.
    *   *Example:* `"512M"`, `"1G"`
*   `compression` (string, *Optional*): Compression type used for compressed filesystems like SquashFS, JFFS2.
    *   *Values:* `"xz"`, `"gzip"`, `"lzo"`, `"zstd"`
    *   *Example:* `"xz"`
*   `makeClean` (boolean, *Optional*): Run `make clean` in the build directory before building the filesystem image.
    *   *Default:* `true`
*   `extraSpace` (string, *Optional*): Add extra free space to the filesystem beyond the calculated content size. Can be absolute (`50M`) or percentage (`10%`).
    *   *Default:* `"10%"`
*   `rootPassword` (string, *Optional*): Set the root user's password. How this is handled (plain text, crypt hash) depends on the build system. Use `rootPasswordMethod` to clarify. Leave empty or unset for no password (locked root).
    *   *Example:* `"$6$rounds=5000$..."` (crypt hash)
*   `rootPasswordMethod` (string, *Optional*): Specifies the format of `rootPassword`.
    *   *Values:* `"plain"`, `"crypt"`, `"none"` (explicitly lock root)
    *   *Default:* `"crypt"`
*   **OverlayFS Options:**
    *   `overlay` (object, *Optional*): Configuration for using an overlay filesystem for persistence on a read-only rootfs.
        *   `enabled` (boolean): Enable overlayfs support. *Default:* `false`
        *   `persistentDevice` (string): Block device to use for the persistent upper layer. *Example:* `"/dev/mmcblk0p3"`
        *   `mountPoint` (string): Mount point for the overlay data. *Default:* `"/overlay"`
*   **Specific Filesystem Type Options:**
    *   `ext4` (object, *Optional*): Options specific to `ext4`.
        *   `journal` (boolean): Enable journaling. *Default:* `true`
        *   `label` (string): Filesystem label. *Default:* `"rootfs"`
        *   `inodeSize` (number): Inode size in bytes. *Default:* `256`
    *   `ubifs` (object, *Optional*): Options specific to `ubifs` (for raw NAND flash).
        *   `lebSize` (string, **Mandatory** if `type` is `ubifs`): Logical Erase Block size of the NAND flash (e.g., `"128K"`).
        *   `minIoSize` (string, **Mandatory** if `type` is `ubifs`): Minimum I/O unit size (page size) of the NAND flash (e.g., `"2K"`).
        *   `maxLebCount` (string, **Mandatory** if `type` is `ubifs`): Maximum Logical Erase Block count for the UBI volume.

---

## `packages`

List of userspace software packages to include in the root filesystem.

*   `packages` (array of objects, **Mandatory**): An array where each object represents a package to be included.
    *   **Package Object Structure:**
        *   `name` (string, **Mandatory**): Name of the package (as known by the build system).
            *   *Example:* `"openssh-server"`, `"python3"`, `"busybox"`
        *   `version` (string, *Optional*): Specific version or version constraint for the package.
            *   *Example:* `"3.10.x"`, `"1.35.0"`
        *   `configOptions` (string or object, *Optional*): Build-system-specific configuration options for the package (e.g., BusyBox config symbols, `./configure` flags). Format depends heavily on the build system.
            *   *Example (Buildroot/BusyBox):* `"CONFIG_FEATURE_FANCY_ECHO=y CONFIG_DMESG=y"`
        *   `patches` (array of strings, *Optional*): List of paths/URLs to patches applied specifically to this package.
        *   `source` (object, *Optional*): Override the default source location/method for this package (build system support varies).
            *   *Example:* `{ "type": "git", "repo": "https://github.com/user/custom-app.git", "branch": "stable" }`

---

## `network`

Configuration for network interfaces and settings.

*   `hostname` (string, *Optional*): The system hostname.
    *   *Default:* `"embedded-linux"`
*   `interfaces` (array of objects, *Optional*): List of network interfaces to configure.
    *   **Interface Object Structure:**
        *   `name` (string, **Mandatory**): Interface name (e.g., `"eth0"`, `"wlan0"`).
        *   `type` (string, **Mandatory**): Configuration method.
            *   *Values:* `"dhcp"`, `"static"`, `"none"` (interface exists but isn't configured here)
        *   `autoStart` (boolean, *Optional*): Bring the interface up automatically at boot.
            *   *Default:* `true`
        *   `macAddress` (string, *Optional*): Set a specific MAC address for the interface.
            *   *Example:* `"00:11:22:33:44:55"`
        *   **Options for `type: 'static'`:**
            *   `ipAddress` (string, **Mandatory** if `type` is `static`): Static IP address. *Example:* `"192.168.1.100"`
            *   `netmask` (string, **Mandatory** if `type` is `static`): Subnet mask. *Example:* `"255.255.255.0"`
            *   `gateway` (string, *Optional*): Default gateway IP address. *Example:* `"192.168.1.1"`
            *   `dnsServers` (array of strings, *Optional*): List of DNS server IP addresses. *Example:* `["8.8.8.8", "1.1.1.1"]`
*   `wifi` (object, *Optional*): Specific settings for Wi-Fi interfaces (often requires `wpa_supplicant` or similar package).
    *   `ssid` (string): Network name (SSID).
    *   `password` (string): Network password/passphrase.
    *   `driver` (string, *Optional*): Specify Wi-Fi driver type if needed. *Example:* `"nl80211"`
*   `firewall` (object, *Optional*): Basic firewall configuration (requires appropriate firewall package like `iptables`). Build system implementation varies greatly.
    *   `enabled` (boolean): Enable basic firewall rules. *Default:* `false`
    *   `rules` (array of strings): List of firewall rules in a build-system-dependent format.
        *   *Example:* `["ALLOW INPUT tcp 22", "DENY OUTPUT udp 53"]`

---

## `userspace`

Configuration related to the userspace environment, init system, users, and system settings.

*   `initSystem` (string, **Mandatory**): The init system to use.
    *   *Values:* `"systemd"`, `"sysvinit"`, `"openrc"`, `"busybox-init"`
    *   *Default:* `"systemd"`
*   `timezone` (string, *Optional*): System timezone.
    *   *Default:* `"UTC"`
    *   *Examples:* `"Europe/London"`, `"America/New_York"`
*   `locale` (object, *Optional*): Locale settings.
    *   `generation` (array of strings): List of locales to generate. Format often includes codeset.
        *   *Default:* `["en_US.UTF-8 UTF-8"]`
    *   `default` (string): The default system locale to set. Must be one of the generated locales.
        *   *Default:* `"en_US.UTF-8"`
*   `users` (array of objects, *Optional*): List of user accounts to create.
    *   **User Object Structure:**
        *   `name` (string, **Mandatory**): Username.
        *   `password` (string, **Mandatory**): User's password (use crypt format if possible).
        *   `passwordMethod` (string): Format of the `password`. *Values:* `"plain"`, `"crypt"`, `"none"` (no login). *Default:* `"crypt"`
        *   `groups` (array of strings): List of supplementary groups the user belongs to.
        *   `shell` (string): User's login shell. *Example:* `"/bin/bash"`, `"/bin/sh"`
        *   `homeDirectory` (string): Path to the user's home directory. *Example:* `"/home/admin"`
        *   `uid` (number, *Optional*): Specify a User ID.
        *   `createHome` (boolean, *Optional*): Whether to create the home directory. *Default:* `true`
*   `groups` (array of objects, *Optional*): Additional groups to create.
    *   **Group Object Structure:**
        *   `name` (string, **Mandatory**): Group name.
        *   `gid` (number, *Optional*): Specify a Group ID.
*   `services` (object, *Optional*): Control which system services (daemons) are enabled or disabled by default. Service names depend on the init system and packages installed.
    *   `enabled` (array of strings): List of services to enable. *Example:* `["sshd", "network-manager"]`
    *   `disabled` (array of strings): List of services to disable. *Example:* `["avahi-daemon"]`
*   `getty` (object, *Optional*): Configuration for the `getty` process (login prompt) on serial/virtual terminals.
    *   `port` (string): Default serial port for console login. *Default:* `"ttyS0"`
    *   `baudRate` (number): Baud rate for the serial console. *Default:* `115200`
    *   `term` (string): Terminal type emulation. *Default:* `"vt102"`

---

## `deviceSpecific`

A section for less common, often hardware-specific settings or configurations that don't fit neatly into other categories.

*   `deviceTree` (object, *Optional*): More specific Device Tree settings beyond kernel build.
    *   `overlays` (array of strings): List of DT overlay filenames (`.dtbo`) to be loaded at boot (requires bootloader/kernel support).
    *   `customDtbPath` (string): Path to a pre-built DTB file to use instead of one built with the kernel.
*   `firmware` (array of strings, *Optional*): List of required firmware blobs/files (paths or names recognized by the build system) to include in the filesystem (e.g., for Wi-Fi, GPU).
    *   *Example:* `["brcm/brcmfmac43430-sdio.bin", "radeon/R100_cp.bin"]`
*   `bootScript` (object, *Optional*): Define a custom script to run early in the boot process (e.g., after bootloader, before init).
    *   `sourcePath` (string): Path to the source script file.
    *   `installPath` (string): Where to install the script in the target filesystem (path determines execution order in SysVinit). *Example:* `"/etc/init.d/S01customboot"`
*   `hardwareQuirks` (object, *Optional*): Key-value pairs for specific hardware workarounds or settings applied by the build system or scripts.
    *   *Example:* `{ "disable_gpu_clock_gating": true }`
*   `modules` (object, *Optional*): Kernel module loading configuration.
    *   `load` (array of strings): Modules to load automatically at boot (e.g., via `/etc/modules-load.d/`).
    *   `blacklist` (array of strings): Modules to prevent from loading (e.g., via `/etc/modprobe.d/blacklist.conf`).
    *   `options` (object): Key-value pairs for module parameters (e.g., via `/etc/modprobe.d/`). *Example:* `{ "i8042": "nomux=1", "drm": "debug=0x04" }`

---

## `buildSystemOverrides`

**Use Sparingly.** This section provides an "escape hatch" to pass configuration options directly to a specific build system when the generalized schema doesn't cover a needed feature. Over-reliance on this section reduces the portability of the configuration.

*   `buildroot` (object, *Optional*): Overrides for Buildroot.
    *   `configFragments` (array of strings): Paths to Buildroot-specific `.config` fragments to merge.
    *   `env` (object): Environment variables to set specifically for the Buildroot build process.
*   `yocto` (object, *Optional*): Overrides for Yocto Project.
    *   `layers` (array of strings or objects): List of meta-layers to include (path or name).
    *   `localConf` (string): String containing lines to append to `local.conf`.
    *   `bblayersConf` (string): String containing lines to append to `bblayers.conf`.
*   `ptxdist` (object, *Optional*): Overrides for PTXdist.
    *   *(Define specific PTXdist overrides here if needed)*
*   *(Add other build systems as needed)*

---
