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

        $availableEffects = $module->getAvailableEffects();
        $selectedEffect = $availableEffects[$configuration->selectedEffect] ?? null;
        if ($selectedEffect === null) {
            return '';
        }

        $assetBundle = Assets::register($view);
        $view->registerJsFile($assetBundle->baseUrl . '/js/' . $selectedEffect['file'], [
            'depends' => [Assets::class],
        ]);

        return '';
    }
}
