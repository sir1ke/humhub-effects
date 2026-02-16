<?php

namespace gm\humhub\modules\effects\models;

use Yii;
use yii\base\Model;
use humhub\components\SettingsManager;

class Configuration extends Model
{
    private const LEGACY_EFFECT_MAP = [
        'enableSakuraFall' => 'sakurafall',
        'enableSnowfall' => 'snowfall',
        'enableLeaffall' => 'leaffall',
        'enableRainfall' => 'rainfall',
        'enablePumpkinFall' => 'pumpkinfall',
        'enableFireworks' => 'fireworks',
        'enableConfetti' => 'confetti',
        'enableHearts' => 'hearts',
    ];

    public ?SettingsManager $settingsManager;

    /**
     * @var array<string, array{file: string, label: string}>
     */
    public array $availableEffects = [];

    public bool $effectsEnabled = false;
    public string $selectedEffect = '';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['effectsEnabled'], 'boolean'],
            [['selectedEffect'], 'string'],
            [['selectedEffect'], 'required', 'when' => function ($model) {
                return (bool)$model->effectsEnabled && !empty($model->availableEffects);
            }],
            [['selectedEffect'], 'in', 'range' => array_keys($this->availableEffects)],
            [['selectedEffect'], function ($attribute) {
                if ($this->effectsEnabled && empty($this->availableEffects)) {
                    $this->addError($attribute, Yii::t('EffectsModule.base', 'No effect scripts found in resources/js.'));
                }
            }],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'effectsEnabled' => Yii::t('EffectsModule.base', 'Enable Effects'),
            'selectedEffect' => Yii::t('EffectsModule.base', 'Select Effect'),
        ];
    }

    /**
     * Returns options for admin dropdown.
     *
     * @return array<string, string>
     */
    public function getEffectOptions(): array
    {
        $options = [];
        foreach ($this->availableEffects as $effectKey => $effectData) {
            $options[$effectKey] = Yii::t('EffectsModule.base', $effectData['label']);
        }

        return $options;
    }

    /**
     * Load settings from SettingsManager.
     */
    public function loadBySettings(): void
    {
        $storedEnabled = $this->settingsManager->get('effectsEnabled');
        $storedSelected = (string)($this->settingsManager->get('selectedEffect') ?? '');

        $this->effectsEnabled = $storedEnabled !== null ? (bool)$storedEnabled : false;
        $this->selectedEffect = $this->normalizeStoredEffectKey($storedSelected);

        if ($this->selectedEffect === '') {
            $this->selectedEffect = $this->detectLegacySelectedEffect();
        }

        if ($storedEnabled === null) {
            $this->effectsEnabled = $this->selectedEffect !== '';
        }

        if ($this->effectsEnabled && $this->selectedEffect === '') {
            $fallbackEffect = array_key_first($this->availableEffects);
            if ($fallbackEffect === null) {
                $this->effectsEnabled = false;
            } else {
                $this->selectedEffect = $fallbackEffect;
            }
        }

        if (!$this->effectsEnabled) {
            $this->selectedEffect = '';
        }
    }

    /**
     * Save settings to SettingsManager.
     */
    public function save(): bool
    {
        if (!$this->validate()) {
            return false;
        }

        $selectedEffect = $this->effectsEnabled ? $this->normalizeStoredEffectKey($this->selectedEffect) : '';
        if ($this->effectsEnabled && $selectedEffect === '' && !empty($this->availableEffects)) {
            $this->addError('selectedEffect', Yii::t('EffectsModule.base', 'Please select an effect.'));
            return false;
        }

        $this->settingsManager->set('effectsEnabled', $this->effectsEnabled);
        $this->settingsManager->set('selectedEffect', $selectedEffect);

        foreach (array_keys(self::LEGACY_EFFECT_MAP) as $legacySettingKey) {
            $this->settingsManager->set($legacySettingKey, false);
        }

        return true;
    }

    private function normalizeStoredEffectKey(string $storedValue): string
    {
        $storedValue = trim($storedValue);
        if ($storedValue === '') {
            return '';
        }

        if (isset($this->availableEffects[$storedValue])) {
            return $storedValue;
        }

        if (isset(self::LEGACY_EFFECT_MAP[$storedValue])) {
            $legacyMapped = self::LEGACY_EFFECT_MAP[$storedValue];
            return isset($this->availableEffects[$legacyMapped]) ? $legacyMapped : '';
        }

        $lowerValue = strtolower($storedValue);
        return isset($this->availableEffects[$lowerValue]) ? $lowerValue : '';
    }

    private function detectLegacySelectedEffect(): string
    {
        foreach (self::LEGACY_EFFECT_MAP as $legacySettingKey => $effectKey) {
            if ((bool)$this->settingsManager->get($legacySettingKey) && isset($this->availableEffects[$effectKey])) {
                return $effectKey;
            }
        }

        return '';
    }
}
