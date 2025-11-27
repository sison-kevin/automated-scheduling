<?php
// Forwarding index.php shim to the actual project which lives in a nested folder.
// This allows accessing the app at /Userpanel-web_project/LavaLust-dev-v4/ even when the
// repository is nested at Userpanel-web_project/Userpanel-web_project/LavaLust-dev-v4.

$target = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'Userpanel-web_project' . DIRECTORY_SEPARATOR . 'LavaLust-dev-v4' . DIRECTORY_SEPARATOR . 'index.php';
if (file_exists($target)) {
    require $target;
    exit;
}

// If target not found, return a friendly 404
http_response_code(404);
echo "Project index not found. Expected: $target";
