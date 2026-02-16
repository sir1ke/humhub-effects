<?php

namespace gm\humhub\modules\effects;

use Yii;
use yii\helpers\FileHelper;
use yii\helpers\Url;
use humhub\components\Module as BaseModule;
use gm\humhub\modules\effects\models\Configuration;

/**
 * Effects module for HumHub.
 */
class Module extends BaseModule
{
    /**
     * @inheritdoc
     */
    public $resourcesPath = 'resources';

    private ?Configuration $configuration = null;

    /**
     * Returns discovered effect scripts from resources/js.
     *
     * @return array<string, array{file: string, label: string}>
     */
    public function getAvailableEffects(): array
    {
        $effectsPath = Yii::getAlias('@effects/resources/js');
        if (!is_dir($effectsPath)) {
            return [];
        }

        $effects = [];
        $files = FileHelper::findFiles($effectsPath, [
            'only' => ['*.js'],
            'recursive' => false,
        ]);

        foreach ($files as $file) {
            $fileName = basename($file);
            $effectKey = pathinfo($fileName, PATHINFO_FILENAME);
            if ($effectKey === '') {
                continue;
            }

            $effects[$effectKey] = [
                'file' => $fileName,
                'label' => $this->buildEffectLabel($effectKey),
            ];
        }

        ksort($effects);
        return $effects;
    }

    public function getConfiguration(): Configuration
    {
        if ($this->configuration === null) {
            $this->configuration = new Configuration([
                'settingsManager' => $this->settings,
                'availableEffects' => $this->getAvailableEffects(),
            ]);
            $this->configuration->loadBySettings();
        }
        return $this->configuration;
    }

    private function buildEffectLabel(string $effectKey): string
    {
        $label = preg_replace('/([a-z])([A-Z])/', '$1 $2', $effectKey);
        $label = str_replace(['-', '_'], ' ', $label);
        $label = preg_replace('/([a-z])(fall)$/i', '$1 $2', $label);
        $label = trim((string)$label);

        return ucwords($label);
    }

    /**
     * @inheritdoc
     */
    public function getConfigUrl()
    {
        return Url::to(['/effects/admin']);
    }
}
