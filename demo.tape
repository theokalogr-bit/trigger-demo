# VHS tape for trigger-demo
# Run with: vhs demo.tape
# Install vhs: https://github.com/charmbracelet/vhs

Output assets/demo.gif

Set Shell "bash"
Set FontSize 14
Set Width 900
Set Height 500
Set Theme "Dracula"

Type "npx trigger.dev@latest run"
Enter
Sleep 5s

# Shows job running and CSV generation
Sleep 3s
