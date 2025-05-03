// postcss.config.js
module.exports = {
  plugins: {
    // Replace 'tailwindcss' key with the new package name
    //'@tailwindcss/postcss': {}, // Or potentially just 'tailwindcss: {}' might still work IF the build tool handles it, but following the error is safer. Let's stick to the error message's implication.
    // OR sometimes just the string works:
    // '@tailwindcss/postcss', // Try this if the above doesn't work

    // More commonly, especially with Next.js, the original config might actually be correct
    // IF @tailwindcss/postcss is installed. Let's try keeping the original first after installing.
    //tailwindcss: {}, // KEEP THIS for now after installing the dependency. Next.js often handles this structure.

    autoprefixer: {},
  },
}
