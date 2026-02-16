<?php

use yii\widgets\ActiveForm;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model gm\humhub\modules\effects\models\Configuration */

$this->title = Yii::t('EffectsModule.base', 'Effects Settings');
$this->params['breadcrumbs'][] = $this->title;

// Define available effects
$effectOptions = [
    'enableSakuraFall' => Yii::t('EffectsModule.base', 'Sakura Fall'),
    'enableSnowfall' => Yii::t('EffectsModule.base', 'Snowfall'),
    'enableLeaffall' => Yii::t('EffectsModule.base', 'Leaf Fall'),
    'enableRainfall' => Yii::t('EffectsModule.base', 'Rainfall'),
];

$effectsEnabledInputId = Html::getInputId($model, 'effectsEnabled');
$selectedEffectInputId = Html::getInputId($model, 'selectedEffect');
?>

<div class="card">
    <div class="card-header">
        <?= Html::encode($this->title) ?>
    </div>
    <div class="card-body">
        <?php if (Yii::$app->session->hasFlash('success')): ?>
            <div class="alert alert-success">
                <?= Yii::$app->session->getFlash('success') ?>
            </div>
        <?php endif; ?>

        <?php $form = ActiveForm::begin(); ?>

        <?= $form->field($model, 'effectsEnabled')->checkbox() ?>

        <?= $form->field($model, 'selectedEffect')->dropDownList($effectOptions, [
            'prompt' => Yii::t('EffectsModule.base', '- Select Effect -'),
            'disabled' => !$model->effectsEnabled,
        ]) ?>

        <div class="mb-3">
            <?= Html::submitButton(
                Yii::t('EffectsModule.base', 'Save'),
                ['class' => 'btn btn-primary']
            ) ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<?php
$this->registerJs(<<<JS
(function() {
    var checkbox = document.getElementById('$effectsEnabledInputId');
    var select = document.getElementById('$selectedEffectInputId');
    if (!checkbox || !select) {
        return;
    }

    function syncSelectState() {
        select.disabled = !checkbox.checked;
        select.required = checkbox.checked;
    }

    checkbox.addEventListener('change', syncSelectState);
    syncSelectState();
})();
JS);
?>
