<?php

namespace gm\humhub\modules\effects\assets;

use yii\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Base asset bundle for effects resources.
 */
class Assets extends AssetBundle
{
    public $sourcePath = '@effects/resources';

    public $js = [];

    public $depends = [
        JqueryAsset::class,
    ];
}
