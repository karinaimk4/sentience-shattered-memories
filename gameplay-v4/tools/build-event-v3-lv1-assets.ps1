param(
  [string]$SourceDir = 'C:\Users\Admin\.codex\generated_images\01a0fc3f-5cc0-79e0-bc6e-482e22c96d3e',
  [string]$ProjectDir = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$assetRoot = Join-Path $ProjectDir 'assets\event-v3\lv1'
$sourceRoot = Join-Path $assetRoot 'generated-source'
New-Item -ItemType Directory -Force -Path $assetRoot, $sourceRoot | Out-Null

$sources = [ordered]@{
  'lv1-ground-source.png'       = 'exec-8fea77a7-61c9-4995-a675-9a9c21d460ac.png'
  'cart-kitchen-source.png'     = 'exec-492c77b2-6c3c-41d0-80d4-d29902c8d2ac.png'
  'barrel-table-source.png'     = 'exec-0d83a1f5-8127-4543-aba2-c21f0b34ae3f.png'
  'barrel-stool-source.png'     = 'exec-1dd37ba3-b875-4b49-b33a-ad227092e0d5.png'
  'wash-basin-source.png'       = 'exec-066256c0-857a-4a49-b60a-7f9e9aa884f9.png'
  'reception-counter-source.png'= 'exec-d6dd95cc-12de-4dde-bc8d-892522823fc1.png'
  'fuhua-tea-seat-source.png'   = 'exec-6952c665-c420-47d5-9fdb-dc98c72fde45.png'
  'lv1-front-source.png'        = 'exec-ad995805-8a6b-4ff6-be02-531efb45f685.png'
}

foreach ($entry in $sources.GetEnumerator()) {
  Copy-Item -LiteralPath (Join-Path $SourceDir $entry.Value) -Destination (Join-Path $sourceRoot $entry.Key) -Force
}

function Save-CoverImage {
  param([string]$InputPath, [string]$OutputPath, [int]$Width, [int]$Height)
  $source = [System.Drawing.Bitmap]::FromFile($InputPath)
  try {
    $targetRatio = $Width / [double]$Height
    $sourceRatio = $source.Width / [double]$source.Height
    if ($sourceRatio -gt $targetRatio) {
      $cropHeight = $source.Height
      $cropWidth = [int][Math]::Round($cropHeight * $targetRatio)
      $cropX = [int][Math]::Floor(($source.Width - $cropWidth) / 2)
      $cropY = 0
    } else {
      $cropWidth = $source.Width
      $cropHeight = [int][Math]::Round($cropWidth / $targetRatio)
      $cropX = 0
      $cropY = [int][Math]::Floor(($source.Height - $cropHeight) / 2)
    }
    $target = New-Object System.Drawing.Bitmap $Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($target)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 0,0,$Width,$Height), (New-Object System.Drawing.Rectangle $cropX,$cropY,$cropWidth,$cropHeight), [System.Drawing.GraphicsUnit]::Pixel)
      } finally { $graphics.Dispose() }
      $target.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $target.Dispose() }
  } finally { $source.Dispose() }
}

function Save-TrimmedProp {
  param([string]$InputPath, [string]$OutputPath, [int]$Width, [int]$Height, [int]$AlphaCutoff = 40)
  $source = [System.Drawing.Bitmap]::FromFile($InputPath)
  try {
    $left=$source.Width; $top=$source.Height; $right=-1; $bottom=-1
    for($y=0; $y -lt $source.Height; $y++) {
      for($x=0; $x -lt $source.Width; $x++) {
        if($source.GetPixel($x,$y).A -ge $AlphaCutoff) {
          if($x -lt $left){$left=$x}; if($x -gt $right){$right=$x}
          if($y -lt $top){$top=$y}; if($y -gt $bottom){$bottom=$y}
        }
      }
    }
    if($right -lt $left -or $bottom -lt $top){ throw "No visible pixels in $InputPath" }
    $cropWidth=$right-$left+1; $cropHeight=$bottom-$top+1
    $scale=[Math]::Min(($Width-2)/[double]$cropWidth,($Height-2)/[double]$cropHeight)
    $drawWidth=[Math]::Max(1,[int][Math]::Floor($cropWidth*$scale))
    $drawHeight=[Math]::Max(1,[int][Math]::Floor($cropHeight*$scale))
    $drawX=[int][Math]::Floor(($Width-$drawWidth)/2)
    $drawY=$Height-$drawHeight-1
    $target = New-Object System.Drawing.Bitmap $Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($target)
      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle $drawX,$drawY,$drawWidth,$drawHeight), (New-Object System.Drawing.Rectangle $left,$top,$cropWidth,$cropHeight), [System.Drawing.GraphicsUnit]::Pixel)
      } finally { $graphics.Dispose() }
      for($y=0; $y -lt $target.Height; $y++) {
        for($x=0; $x -lt $target.Width; $x++) {
          $pixel=$target.GetPixel($x,$y)
          if($pixel.A -lt $AlphaCutoff){$target.SetPixel($x,$y,[System.Drawing.Color]::Transparent)}
        }
      }
      $target.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $target.Dispose() }
  } finally { $source.Dispose() }
}

Save-CoverImage (Join-Path $sourceRoot 'lv1-ground-source.png') (Join-Path $assetRoot 'lv1-ground.png') 640 416
Save-TrimmedProp (Join-Path $sourceRoot 'cart-kitchen-source.png') (Join-Path $assetRoot 'cart-kitchen.png') 96 72
Save-TrimmedProp (Join-Path $sourceRoot 'barrel-table-source.png') (Join-Path $assetRoot 'barrel-table.png') 64 40
Save-TrimmedProp (Join-Path $sourceRoot 'barrel-stool-source.png') (Join-Path $assetRoot 'barrel-stool.png') 32 28
Save-TrimmedProp (Join-Path $sourceRoot 'wash-basin-source.png') (Join-Path $assetRoot 'wash-basin.png') 32 40
Save-TrimmedProp (Join-Path $sourceRoot 'reception-counter-source.png') (Join-Path $assetRoot 'reception-counter.png') 96 48
Save-TrimmedProp (Join-Path $sourceRoot 'fuhua-tea-seat-source.png') (Join-Path $assetRoot 'fuhua-tea-seat.png') 40 44
Save-TrimmedProp (Join-Path $sourceRoot 'lv1-front-source.png') (Join-Path $assetRoot 'lv1-front.png') 640 128 24

Write-Host "Lv.1 environment assets built in $assetRoot"
