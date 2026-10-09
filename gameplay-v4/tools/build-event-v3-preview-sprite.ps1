param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Bitmap]::FromFile($InputPath)
$cellWidth = 48
$cellHeight = 64
$sheet = New-Object System.Drawing.Bitmap(144, 64, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half

for ($pose = 0; $pose -lt 3; $pose++) {
  $left = [int][Math]::Floor($pose * $source.Width / 3)
  $right = [int][Math]::Floor(($pose + 1) * $source.Width / 3) - 1
  $minX = $right
  $minY = $source.Height - 1
  $maxX = $left
  $maxY = 0
  $found = $false

  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = $left; $x -le $right; $x++) {
      if ($source.GetPixel($x, $y).A -ge 128) {
        $found = $true
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if (-not $found) { continue }
  $sourceWidth = $maxX - $minX + 1
  $sourceHeight = $maxY - $minY + 1
  $scale = [Math]::Min(46.0 / $sourceWidth, 58.0 / $sourceHeight)
  $targetWidth = [Math]::Max(1, [int][Math]::Round($sourceWidth * $scale))
  $targetHeight = [Math]::Max(1, [int][Math]::Round($sourceHeight * $scale))
  $targetX = $pose * $cellWidth + [int][Math]::Floor(($cellWidth - $targetWidth) / 2)
  $targetY = 60 - $targetHeight
  $sourceRect = New-Object System.Drawing.Rectangle($minX, $minY, $sourceWidth, $sourceHeight)
  $targetRect = New-Object System.Drawing.Rectangle($targetX, $targetY, $targetWidth, $targetHeight)
  $graphics.DrawImage($source, $targetRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
}

$graphics.Dispose()
$source.Dispose()

for ($y = 0; $y -lt $sheet.Height; $y++) {
  for ($x = 0; $x -lt $sheet.Width; $x++) {
    $pixel = $sheet.GetPixel($x, $y)
    $alpha = if ($pixel.A -ge 128) { 255 } else { 0 }
    $sheet.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
  }
}

$parent = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $parent | Out-Null
$sheet.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
