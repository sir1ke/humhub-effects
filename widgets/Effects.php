<?php

namespace gm\humhub\modules\effects\widgets;

use Yii;
use humhub\components\Widget;
use gm\humhub\modules\effects\assets\Assets;

/**
 * Effects widget to add the configured visual effect to the page.
 */
class Effects extends Widget
{
    /**
     * @inheritdoc
     */
    public function run()
    {
        $view = $this->getView();
        $module = Yii::$app->getModule('effects');

        if ($module === null) {
            throw new \yii\base\InvalidConfigException("Module 'effects' is not available.");
        }

        $configuration = $module->getConfiguration();
        if (!$configuration->effectsEnabled) {
            return '';
        }

        $effectScripts = [
            'enableSnowfall' => 'snowfall.js',
            'enableSakuraFall' => 'sakurafall.js',
            'enableLeaffall' => 'leaffall.js',
            'enableRainfall' => 'rainfall.js',
        ];

        $selectedScript = $effectScripts[$configuration->selectedEffect] ?? null;
        if ($selectedScript === null) {
            return '';
        }

        $assetBundle = Assets::register($view);
        $view->registerJsFile($assetBundle->baseUrl . '/js/' . $selectedScript, [
            'depends' => [Assets::class],
        ]);

        return '';
    }
}
