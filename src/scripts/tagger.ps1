# Prefixo da tag (fixo)
$tagPrefix = "rc"

# Data de hoje
$datePart = Get-Date -Format "yyyyMMdd"

# Pega todas as tags no formato rc-X.Y.Z_YYYYMMDD.XXX
$existingTags = git tag | Where-Object { $_ -match "^$tagPrefix-\d+\.\d+\.\d+_\d{8}\.\d{3}$" }

if ($existingTags.Count -eq 0) {
    $lastVersion = "0.0.0"
}
else {
    # Ordena para pegar a maior versão (ignora data e sequência por enquanto)
    $lastVersion = $existingTags |
    Sort-Object {
        $versionPart = ($_ -replace "^$tagPrefix-", "") -replace "_.*$", ""
        [Version]$versionPart
    } -Descending |
    Select-Object -First 1

    $lastVersion = ($lastVersion -replace "^$tagPrefix-", "") -replace "_.*$", ""
}

# Divide a versão atual
$versionParts = $lastVersion.Split(".")
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

# Descrição da tag
$tagMessage = Read-Host '📝 Digite a descricao da tag (use "major", "minor" ou "patch")'

if (-not $tagMessage) {
    Write-Host '❌ A descricao da tag eh obrigatória.'
    exit 1
}

# Determina tipo de versão
if ($tagMessage -match "major") {
    $major++
    $minor = 0
    $patch = 0
}
elseif ($tagMessage -match "minor") {
    $minor++
    $patch = 0
}
else {
    $patch++
}

# Nova versão semântica
$newSemver = "$major.$minor.$patch"

# Filtra apenas as tags com a nova versão e a data atual
$todayTags = $existingTags | Where-Object {
    $_ -match "^$tagPrefix-$newSemver" + "_$datePart\.\d{3}$"
}


# Determina o próximo número sequencial do dia
$nextSeq = "{0:D3}" -f (($todayTags.Count) + 1)

# Define nova tag
$newTag = "$tagPrefix-$newSemver" + "_$datePart.$nextSeq"


# Cria tag anotada
git tag -a $newTag -m "'$tagMessage'"

if ($LASTEXITCODE -ne 0) {
    Write-Host '❌ Falha ao criar a tag. Verifique erros acima.'
    exit 1
}

# Push da tag
git push origin $newTag

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tag $newTag criada e enviada com sucesso!"
}
else {
    Write-Host '❌ Falha ao enviar a tag para o repositorio remoto.'
}
