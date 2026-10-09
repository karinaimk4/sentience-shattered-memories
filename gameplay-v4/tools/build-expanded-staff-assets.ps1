Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$charactersRoot = Join-Path $projectRoot 'assets/event-demo/characters'
$portraitRoot = Join-Path $projectRoot 'assets/event-v3/gacha-portraits'
$sheetRoot = Join-Path $projectRoot 'assets/event-v3/staff-animation'
$modelRoot = Join-Path $projectRoot 'assets/event-v3/staff-model-sheets'

New-Item -ItemType Directory -Force -Path $portraitRoot, $sheetRoot, $modelRoot | Out-Null

$staff = @(
    @{
        Id = 'carole'
        Portrait = Join-Path $charactersRoot 'carole-25d.png'
        Generated = 'C:\Users\Admin\.codex\generated_images\01a0fc3f-5cc0-79e0-bc6e-482e22c96d3e\exec-5d25326d-ed90-423f-bdc1-ad6eff5c2360.png'
    },
    @{
        Id = 'susannah'
        Portrait = Join-Path $charactersRoot 'susannah-25d.png'
        Generated = 'C:\Users\Admin\.codex\generated_images\01a0fc3f-5cc0-79e0-bc6e-482e22c96d3e\exec-56d7aca2-ed1f-4586-9b9f-4130b6ec8415.png'
    }
)

function Get-AlphaBounds {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [System.Drawing.Rectangle]$Cell
    )

    $minX = $Cell.Right
    $minY = $Cell.Bottom
    $maxX = $Cell.Left - 1
    $maxY = $Cell.Top - 1

    for ($y = $Cell.Top; $y -lt $Cell.Bottom; $y++) {
        for ($x = $Cell.Left; $x -lt $Cell.Right; $x++) {
            if ($Bitmap.GetPixel($x, $y).A -gt 10) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    if ($maxX -lt $minX -or $maxY -lt $minY) { return $Cell }
    return [System.Drawing.Rectangle]::FromLTRB($minX, $minY, $maxX + 1, $maxY + 1)
}

foreach ($entry in $staff) {
    if (-not (Test-Path -LiteralPath $entry.Generated)) {
        throw "Missing generated model sheet: $($entry.Generated)"
    }

    Copy-Item -LiteralPath $entry.Portrait -Destination (Join-Path $portraitRoot "$($entry.Id)-v1.png") -Force
    Copy-Item -LiteralPath $entry.Generated -Destination (Join-Path $modelRoot "$($entry.Id)-4x9-source-v1.png") -Force

    $source = [System.Drawing.Bitmap]::FromFile($entry.Generated)
    $target = New-Object System.Drawing.Bitmap 192, 576, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($target)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    for ($row = 0; $row -lt 9; $row++) {
        $top = [int][Math]::Floor($row * $source.Height / 9)
        $bottom = [int][Math]::Floor(($row + 1) * $source.Height / 9)
        for ($column = 0; $column -lt 4; $column++) {
            $left = [int][Math]::Floor($column * $source.Width / 4)
            $right = [int][Math]::Floor(($column + 1) * $source.Width / 4)
            $cell = [System.Drawing.Rectangle]::FromLTRB($left, $top, $right, $bottom)
            $bounds = Get-AlphaBounds -Bitmap $source -Cell $cell

            # Walking silhouettes must stay the same apparent height even when a
            # loose hand/hair pixel makes one generated cell unusually wide.
            # Work/emote/rest rows keep their full prop/pose inside the frame.
            $scale = if ($row -le 6) {
                60 / $bounds.Height
            } else {
                [Math]::Min(44 / $bounds.Width, 60 / $bounds.Height)
            }
            $drawWidth = [Math]::Max(1, [int][Math]::Round($bounds.Width * $scale))
            $drawHeight = [Math]::Max(1, [int][Math]::Round($bounds.Height * $scale))
            $drawX = $column * 48 + [int][Math]::Floor((48 - $drawWidth) / 2)
            $drawY = $row * 64 + 62 - $drawHeight
            $destination = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight
            $graphics.SetClip((New-Object System.Drawing.Rectangle ($column * 48), ($row * 64), 48, 64))
            $graphics.DrawImage($source, $destination, $bounds, [System.Drawing.GraphicsUnit]::Pixel)
            $graphics.ResetClip()
        }
    }

    $target.Save((Join-Path $sheetRoot "$($entry.Id).png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $target.Dispose()
    $source.Dispose()
}

